// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Script, console} from "forge-std/Script.sol";
import {KYCRegistry} from "../src/KYCRegistry.sol";
import {IndonesiaPropertyToken} from "../src/IndonesiaPropertyToken.sol";

/// @title DeployScript
/// @notice Deployment script for IDProperty contracts on Mantle Sepolia
contract DeployScript is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy KYCRegistry first
        KYCRegistry kyc = new KYCRegistry();
        console.log("KYCRegistry deployed at:", address(kyc));

        // 2. Deploy PropertyToken with KYCRegistry address
        IndonesiaPropertyToken token = new IndonesiaPropertyToken(
            "Sudirman Tower Token", // Token name
            "SDMN", // Token symbol
            address(kyc), // KYC Registry address
            "Apartemen Sudirman Tower", // Property name
            "Jakarta Selatan", // Location
            50_000_000_000, // Total value: Rp 50 Miliar
            10000 ether // Total tokens: 10,000
        );
        console.log("IndonesiaPropertyToken deployed at:", address(token));

        vm.stopBroadcast();

        // Summary
        console.log("");
        console.log("===========================================");
        console.log("       DEPLOYMENT SUMMARY - IDProperty");
        console.log("===========================================");
        console.log("Network: Mantle Sepolia (Chain ID: 5003)");
        console.log("-------------------------------------------");
        console.log("KYCRegistry:           ", address(kyc));
        console.log("IndonesiaPropertyToken:", address(token));
        console.log("-------------------------------------------");
        console.log("Property: Apartemen Sudirman Tower");
        console.log("Location: Jakarta Selatan");
        console.log("Total Value: Rp 50,000,000,000");
        console.log("Total Tokens: 10,000");
        console.log("Token Value: Rp 5,000,000 per token");
        console.log("===========================================");
    }
}
