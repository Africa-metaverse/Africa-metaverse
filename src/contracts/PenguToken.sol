// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract PenguToken is ERC20, Ownable {
    using Counters for Counters.Counter;
    
    // Owner address with admin powers
    address public constant ADMIN_OWNER = 0x01661103E022CB065cFDD1fB8EDC75c9c6b6234f;
    
    // Leaderboard tracking
    mapping(address => uint256) public playerScores;
    mapping(uint256 => address) public leaderboard;
    uint256 public leaderboardSize;
    
    // Game costs
    uint256 public constant GAME_2048_COST = 10 * 10**18;
    uint256 public constant GAME_TICTACTOE_COST = 5 * 10**18;
    uint256 public constant GAME_RPS_COST = 3 * 10**18;
    
    // Token buying
    uint256 public constant TOKEN_PRICE = 0.001 ether; // 0.001 ETH per 1000 tokens
    uint256 public constant TOKENS_PER_PURCHASE = 1000 * 10**18;
    
    // Daily rewards
    mapping(address => uint256) public lastDailyClaim;
    uint256 public constant DAILY_REWARD = 200 * 10**18;
    uint256 public constant DAILY_COOLDOWN = 24 hours;
    
    // Events
    event GamePlayed(address player, string game, uint256 cost);
    event DailyRewardClaimed(address player, uint256 amount);
    event LeaderboardUpdated(address player, uint256 score);
    event TokensTransferred(address from, address to, uint256 amount);
    event TokensPurchased(address buyer, uint256 amount, uint256 cost);
    event AdminAction(address admin, string action);
    
    constructor() ERC20("Pengu Token", "PENGU") {
        _mint(msg.sender, 1000000 * 10**18); // 1M tokens for distribution
        leaderboardSize = 0;
    }
    
    // Modifier for admin functions
    modifier onlyAdmin() {
        require(msg.sender == ADMIN_OWNER, "Only admin can call this function");
        _;
    }
    
    // Check if address is admin
    function isAdmin(address _address) public pure returns (bool) {
        return _address == ADMIN_OWNER;
    }
    
    // Buy tokens with ETH
    function buyTokens() external payable {
        require(msg.value >= TOKEN_PRICE, "Insufficient ETH for token purchase");
        require(msg.value % TOKEN_PRICE == 0, "ETH amount must be multiple of token price");
        
        uint256 tokenAmount = (msg.value / TOKEN_PRICE) * TOKENS_PER_PURCHASE;
        _mint(msg.sender, tokenAmount);
        
        emit TokensPurchased(msg.sender, tokenAmount, msg.value);
    }
    
    // Get token price info
    function getTokenPriceInfo() external pure returns (uint256 price, uint256 tokensPerPurchase) {
        return (TOKEN_PRICE, TOKENS_PER_PURCHASE);
    }
    
    // Mint tokens to new players (admin only)
    function mintToPlayer(address player, uint256 amount) external onlyAdmin {
        _mint(player, amount);
        emit AdminAction(msg.sender, "Minted tokens to player");
    }
    
    // Play games and deduct tokens (free for admin)
    function playGame(string memory gameName) external {
        uint256 cost;
        if (keccak256(bytes(gameName)) == keccak256(bytes("2048"))) {
            cost = GAME_2048_COST;
        } else if (keccak256(bytes(gameName)) == keccak256(bytes("tictactoe"))) {
            cost = GAME_TICTACTOE_COST;
        } else if (keccak256(bytes(gameName)) == keccak256(bytes("rps"))) {
            cost = GAME_RPS_COST;
        } else {
            revert("Invalid game");
        }
        
        // Admin plays for free
        if (msg.sender != ADMIN_OWNER) {
            require(balanceOf(msg.sender) >= cost, "Insufficient tokens");
            _burn(msg.sender, cost);
        }
        
        // Update leaderboard
        playerScores[msg.sender] += 1;
        updateLeaderboard(msg.sender, playerScores[msg.sender]);
        
        emit GamePlayed(msg.sender, gameName, msg.sender == ADMIN_OWNER ? 0 : cost);
    }
    
    // Claim daily reward (admin gets bonus)
    function claimDailyReward() external {
        require(block.timestamp >= lastDailyClaim[msg.sender] + DAILY_COOLDOWN, "Daily reward not ready");
        
        uint256 reward = DAILY_REWARD;
        if (msg.sender == ADMIN_OWNER) {
            reward = DAILY_REWARD * 2; // Admin gets double reward
        }
        
        _mint(msg.sender, reward);
        lastDailyClaim[msg.sender] = block.timestamp;
        
        emit DailyRewardClaimed(msg.sender, reward);
    }
    
    // Admin functions
    function adminMintTokens(address to, uint256 amount) external onlyAdmin {
        _mint(to, amount);
        emit AdminAction(msg.sender, "Admin minted tokens");
    }
    
    function adminBurnTokens(address from, uint256 amount) external onlyAdmin {
        _burn(from, amount);
        emit AdminAction(msg.sender, "Admin burned tokens");
    }
    
    function adminTransferTokens(address from, address to, uint256 amount) external onlyAdmin {
        _transfer(from, to, amount);
        emit AdminAction(msg.sender, "Admin transferred tokens");
    }
    
    function adminSetPlayerScore(address player, uint256 score) external onlyAdmin {
        playerScores[player] = score;
        updateLeaderboard(player, score);
        emit AdminAction(msg.sender, "Admin set player score");
    }
    
    // Withdraw ETH from contract (admin only)
    function withdrawETH() external onlyAdmin {
        uint256 balance = address(this).balance;
        payable(ADMIN_OWNER).transfer(balance);
        emit AdminAction(msg.sender, "Withdrew ETH from contract");
    }
    
    // Update leaderboard
    function updateLeaderboard(address player, uint256 score) internal {
        // Simple leaderboard update - in production, use a more sophisticated algorithm
        if (leaderboardSize < 100) {
            leaderboard[leaderboardSize] = player;
            leaderboardSize++;
        }
        
        emit LeaderboardUpdated(player, score);
    }
    
    // Get leaderboard
    function getLeaderboard(uint256 start, uint256 count) external view returns (address[] memory, uint256[] memory) {
        require(start + count <= leaderboardSize, "Invalid range");
        
        address[] memory addresses = new address[](count);
        uint256[] memory scores = new uint256[](count);
        
        for (uint256 i = 0; i < count; i++) {
            addresses[i] = leaderboard[start + i];
            scores[i] = playerScores[addresses[i]];
        }
        
        return (addresses, scores);
    }
    
    // Get player stats
    function getPlayerStats(address player) external view returns (uint256 score, uint256 balance, bool canClaimDaily) {
        return (
            playerScores[player],
            balanceOf(player),
            block.timestamp >= lastDailyClaim[player] + DAILY_COOLDOWN
        );
    }
    
    // Check if can claim daily reward
    function canClaimDailyReward(address player) external view returns (bool) {
        return block.timestamp >= lastDailyClaim[player] + DAILY_COOLDOWN;
    }
    
    // Get game cost
    function getGameCost(string memory gameName) external pure returns (uint256) {
        if (keccak256(bytes(gameName)) == keccak256(bytes("2048"))) {
            return GAME_2048_COST;
        } else if (keccak256(bytes(gameName)) == keccak256(bytes("tictactoe"))) {
            return GAME_TICTACTOE_COST;
        } else if (keccak256(bytes(gameName)) == keccak256(bytes("rps"))) {
            return GAME_RPS_COST;
        }
        return 0;
    }
}

// NFT Achievement Contract
contract PenguAchievement is ERC721, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIds;
    
    struct Achievement {
        string name;
        string description;
        string imageURI;
        uint256 requiredScore;
    }
    
    mapping(uint256 => Achievement) public achievements;
    mapping(address => uint256[]) public playerAchievements;
    
    event AchievementMinted(address player, uint256 tokenId, string achievementName);
    
    constructor() ERC721("Pengu Achievement", "PENGUACH") {}
    
    function addAchievement(
        string memory name,
        string memory description,
        string memory imageURI,
        uint256 requiredScore
    ) external onlyOwner {
        uint256 achievementId = _tokenIds.current();
        achievements[achievementId] = Achievement(name, description, imageURI, requiredScore);
        _tokenIds.increment();
    }
    
    function mintAchievement(address player, uint256 achievementId) external onlyOwner {
        require(achievementId < _tokenIds.current(), "Achievement does not exist");
        
        _mint(player, achievementId);
        playerAchievements[player].push(achievementId);
        
        emit AchievementMinted(player, achievementId, achievements[achievementId].name);
    }
    
    function getPlayerAchievements(address player) external view returns (uint256[] memory) {
        return playerAchievements[player];
    }
    
    function getAchievement(uint256 achievementId) external view returns (Achievement memory) {
        return achievements[achievementId];
    }
} 