// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract HarvestToken is ERC20, Ownable, ReentrancyGuard {
    uint256 public constant INITIAL_SUPPLY = 1000000 * 10**18; // 1 million tokens
    uint256 public constant FARMING_REWARD = 10 * 10**18; // 10 tokens per harvest
    uint256 public constant PLANTING_COST = 5 * 10**18; // 5 tokens to plant
    
    struct Crop {
        uint256 plantedAt;
        uint256 growthTime;
        bool isHarvested;
        string cropType;
    }
    
    struct Farm {
        uint256[] cropIds;
        uint256 totalHarvested;
        uint256 lastHarvestTime;
    }
    
    mapping(address => Farm) public farms;
    mapping(uint256 => Crop) public crops;
    uint256 public nextCropId = 1;
    
    event CropPlanted(address indexed farmer, uint256 cropId, string cropType);
    event CropHarvested(address indexed farmer, uint256 cropId, uint256 reward);
    event FarmCreated(address indexed farmer);
    
    constructor() ERC20("Harvest Token", "HARVEST") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
    
    function plantCrop(string memory cropType) external nonReentrant {
        require(balanceOf(msg.sender) >= PLANTING_COST, "Insufficient tokens to plant");
        
        _burn(msg.sender, PLANTING_COST);
        
        uint256 cropId = nextCropId++;
        crops[cropId] = Crop({
            plantedAt: block.timestamp,
            growthTime: 300, // 5 minutes for demo
            isHarvested: false,
            cropType: cropType
        });
        
        farms[msg.sender].cropIds.push(cropId);
        
        emit CropPlanted(msg.sender, cropId, cropType);
    }
    
    function harvestCrop(uint256 cropId) external nonReentrant {
        require(crops[cropId].plantedAt > 0, "Crop does not exist");
        require(!crops[cropId].isHarvested, "Crop already harvested");
        require(block.timestamp >= crops[cropId].plantedAt + crops[cropId].growthTime, "Crop not ready");
        
        crops[cropId].isHarvested = true;
        farms[msg.sender].totalHarvested += FARMING_REWARD;
        farms[msg.sender].lastHarvestTime = block.timestamp;
        
        _mint(msg.sender, FARMING_REWARD);
        
        emit CropHarvested(msg.sender, cropId, FARMING_REWARD);
    }
    
    function getFarm(address farmer) external view returns (uint256[] memory cropIds, uint256 totalHarvested, uint256 lastHarvestTime) {
        Farm storage farm = farms[farmer];
        return (farm.cropIds, farm.totalHarvested, farm.lastHarvestTime);
    }
    
    function getCrop(uint256 cropId) external view returns (Crop memory) {
        return crops[cropId];
    }
    
    function getReadyCrops(address farmer) external view returns (uint256[] memory) {
        Farm storage farm = farms[farmer];
        uint256[] memory readyCrops = new uint256[](farm.cropIds.length);
        uint256 readyCount = 0;
        
        for (uint256 i = 0; i < farm.cropIds.length; i++) {
            uint256 cropId = farm.cropIds[i];
            Crop storage crop = crops[cropId];
            
            if (!crop.isHarvested && block.timestamp >= crop.plantedAt + crop.growthTime) {
                readyCrops[readyCount] = cropId;
                readyCount++;
            }
        }
        
        // Resize array to actual count
        uint256[] memory result = new uint256[](readyCount);
        for (uint256 i = 0; i < readyCount; i++) {
            result[i] = readyCrops[i];
        }
        
        return result;
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
} 