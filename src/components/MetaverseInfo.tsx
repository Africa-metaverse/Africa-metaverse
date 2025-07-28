import React from 'react';

const MetaverseInfo: React.FC = () => {
  return (
    <section>
      <h2>Abstract Mainnet (abs.xyz)</h2>
      <ul>
        <li>Chain ID: 2741</li>
        <li>RPC: https://api.mainnet.abs.xyz</li>
        <li>Explorer: https://abscan.org</li>
        <li>Currency: ETH</li>
      </ul>
      <p>
        This app is running on the Abstract Layer 2, a zk-rollup built to power
        consumer blockchain applications with low fees and high throughput.
      </p>
    </section>
  );
};

export default MetaverseInfo;