// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Test, console} from "forge-std/Test.sol";
import {KYCRegistry} from "../src/KYCRegistry.sol";

contract KYCRegistryTest is Test {
    KYCRegistry public kyc;

    // Test accounts
    address public admin;
    address public investor1;
    address public investor2;
    address public nonAdmin;

    // Test constants
    uint16 public constant INDONESIA = 360;
    uint16 public constant SINGAPORE = 702;
    uint256 public constant VALID_DAYS = 365;

    // ============================================
    // SETUP
    // ============================================

    function setUp() public {
        admin = address(this);
        investor1 = makeAddr("investor1");
        investor2 = makeAddr("investor2");
        nonAdmin = makeAddr("nonAdmin");

        kyc = new KYCRegistry();
    }

    // ============================================
    // CONSTRUCTOR TESTS
    // ============================================

    function test_ConstructorSetsAdmin() public view {
        assertEq(kyc.admin(), admin);
    }

    function test_InitialTotalInvestorsIsZero() public view {
        assertEq(kyc.totalInvestors(), 0);
    }

    // ============================================
    // REGISTER INVESTOR TESTS
    // ============================================

    function test_RegisterInvestorBasic() public {
        kyc.registerInvestor(
            investor1,
            KYCRegistry.KYCLevel.BASIC,
            INDONESIA,
            VALID_DAYS
        );

        assertEq(kyc.totalInvestors(), 1);
        assertTrue(kyc.isVerified(investor1));

        (
            KYCRegistry.KYCLevel level,
            uint256 expiryDate,
            uint16 countryCode,
            bool isActive
        ) = kyc.getInvestor(investor1);

        assertEq(uint8(level), uint8(KYCRegistry.KYCLevel.BASIC));
        assertEq(countryCode, INDONESIA);
        assertTrue(isActive);
        assertGt(expiryDate, block.timestamp);
    }

    function test_RegisterInvestorVerified() public {
        kyc.registerInvestor(
            investor1,
            KYCRegistry.KYCLevel.VERIFIED,
            INDONESIA,
            VALID_DAYS
        );

        (KYCRegistry.KYCLevel level, , , ) = kyc.getInvestor(investor1);
        assertEq(uint8(level), uint8(KYCRegistry.KYCLevel.VERIFIED));
    }

    function test_RegisterInvestorAccredited() public {
        kyc.registerInvestor(
            investor1,
            KYCRegistry.KYCLevel.ACCREDITED,
            INDONESIA,
            VALID_DAYS
        );

        (KYCRegistry.KYCLevel level, , , ) = kyc.getInvestor(investor1);
        assertEq(uint8(level), uint8(KYCRegistry.KYCLevel.ACCREDITED));
    }

    function test_RegisterMultipleInvestors() public {
        kyc.registerInvestor(
            investor1,
            KYCRegistry.KYCLevel.BASIC,
            INDONESIA,
            VALID_DAYS
        );
        kyc.registerInvestor(
            investor2,
            KYCRegistry.KYCLevel.VERIFIED,
            SINGAPORE,
            VALID_DAYS
        );

        assertEq(kyc.totalInvestors(), 2);
        assertTrue(kyc.isVerified(investor1));
        assertTrue(kyc.isVerified(investor2));
    }

    // ============================================
    // REGISTER INVESTOR REVERT TESTS
    // ============================================

    function test_RevertWhen_NonAdminRegisters() public {
        vm.prank(nonAdmin);
        vm.expectRevert(KYCRegistry.NotAdmin.selector);
        kyc.registerInvestor(
            investor1,
            KYCRegistry.KYCLevel.BASIC,
            INDONESIA,
            VALID_DAYS
        );
    }

    function test_RevertWhen_RegisterZeroAddress() public {
        vm.expectRevert(KYCRegistry.InvalidAddress.selector);
        kyc.registerInvestor(
            address(0),
            KYCRegistry.KYCLevel.BASIC,
            INDONESIA,
            VALID_DAYS
        );
    }

    function test_RevertWhen_RegisterWithNoneLevel() public {
        vm.expectRevert(KYCRegistry.InvalidKYCLevel.selector);
        kyc.registerInvestor(
            investor1,
            KYCRegistry.KYCLevel.NONE,
            INDONESIA,
            VALID_DAYS
        );
    }

    function test_RevertWhen_RegisterAlreadyRegistered() public {
        kyc.registerInvestor(
            investor1,
            KYCRegistry.KYCLevel.BASIC,
            INDONESIA,
            VALID_DAYS
        );

        vm.expectRevert(KYCRegistry.AlreadyRegistered.selector);
        kyc.registerInvestor(
            investor1,
            KYCRegistry.KYCLevel.VERIFIED,
            INDONESIA,
            VALID_DAYS
        );
    }

    // ============================================
    // UPDATE INVESTOR TESTS
    // ============================================

    function test_UpdateInvestorLevel() public {
        kyc.registerInvestor(
            investor1,
            KYCRegistry.KYCLevel.BASIC,
            INDONESIA,
            VALID_DAYS
        );

        kyc.updateInvestor(investor1, KYCRegistry.KYCLevel.VERIFIED);

        (KYCRegistry.KYCLevel level, , , ) = kyc.getInvestor(investor1);
        assertEq(uint8(level), uint8(KYCRegistry.KYCLevel.VERIFIED));
    }

    function test_RevertWhen_UpdateNonRegistered() public {
        vm.expectRevert(KYCRegistry.NotRegistered.selector);
        kyc.updateInvestor(investor1, KYCRegistry.KYCLevel.VERIFIED);
    }

    function test_RevertWhen_NonAdminUpdates() public {
        kyc.registerInvestor(
            investor1,
            KYCRegistry.KYCLevel.BASIC,
            INDONESIA,
            VALID_DAYS
        );

        vm.prank(nonAdmin);
        vm.expectRevert(KYCRegistry.NotAdmin.selector);
        kyc.updateInvestor(investor1, KYCRegistry.KYCLevel.VERIFIED);
    }

    // ============================================
    // EXTEND EXPIRY TESTS
    // ============================================

    function test_ExtendExpiry() public {
        kyc.registerInvestor(
            investor1,
            KYCRegistry.KYCLevel.BASIC,
            INDONESIA,
            VALID_DAYS
        );

        (, uint256 originalExpiry, , ) = kyc.getInvestor(investor1);

        kyc.extendExpiry(investor1, 30);

        (, uint256 newExpiry, , ) = kyc.getInvestor(investor1);
        assertEq(newExpiry, originalExpiry + 30 days);
    }

    // ============================================
    // REVOKE INVESTOR TESTS
    // ============================================

    function test_RevokeInvestor() public {
        kyc.registerInvestor(
            investor1,
            KYCRegistry.KYCLevel.BASIC,
            INDONESIA,
            VALID_DAYS
        );

        kyc.revokeInvestor(investor1);

        assertFalse(kyc.isVerified(investor1));
        assertEq(kyc.totalInvestors(), 0);

        (, , , bool isActive) = kyc.getInvestor(investor1);
        assertFalse(isActive);
    }

    function test_RevertWhen_RevokeNonRegistered() public {
        vm.expectRevert(KYCRegistry.NotRegistered.selector);
        kyc.revokeInvestor(investor1);
    }

    function test_RevertWhen_NonAdminRevokes() public {
        kyc.registerInvestor(
            investor1,
            KYCRegistry.KYCLevel.BASIC,
            INDONESIA,
            VALID_DAYS
        );

        vm.prank(nonAdmin);
        vm.expectRevert(KYCRegistry.NotAdmin.selector);
        kyc.revokeInvestor(investor1);
    }

    // ============================================
    // TWO-STEP ADMIN TRANSFER TESTS
    // ============================================

    function test_TwoStepAdminTransfer() public {
        kyc.proposeAdmin(nonAdmin);
        assertEq(kyc.pendingAdmin(), nonAdmin);
        assertEq(kyc.admin(), admin);

        vm.prank(nonAdmin);
        kyc.acceptAdmin();
        assertEq(kyc.admin(), nonAdmin);
        assertEq(kyc.pendingAdmin(), address(0));
    }

    function test_RevertWhen_ProposeAdminToZero() public {
        vm.expectRevert(KYCRegistry.InvalidAddress.selector);
        kyc.proposeAdmin(address(0));
    }

    function test_RevertWhen_NonAdminProposesAdmin() public {
        vm.prank(nonAdmin);
        vm.expectRevert(KYCRegistry.NotAdmin.selector);
        kyc.proposeAdmin(investor1);
    }

    function test_RevertWhen_WrongAddressAcceptsAdmin() public {
        kyc.proposeAdmin(nonAdmin);

        vm.prank(investor1);
        vm.expectRevert(KYCRegistry.NotPendingAdmin.selector);
        kyc.acceptAdmin();
    }

    // ============================================
    // PAUSABLE TESTS
    // ============================================

    function test_PauseAndUnpause() public {
        assertFalse(kyc.paused());

        kyc.pause();
        assertTrue(kyc.paused());

        kyc.unpause();
        assertFalse(kyc.paused());
    }

    function test_RevertWhen_RegisterWhilePaused() public {
        kyc.pause();

        vm.expectRevert(KYCRegistry.ContractPaused.selector);
        kyc.registerInvestor(
            investor1,
            KYCRegistry.KYCLevel.BASIC,
            INDONESIA,
            VALID_DAYS
        );
    }

    function test_RevertWhen_UpdateWhilePaused() public {
        kyc.registerInvestor(
            investor1,
            KYCRegistry.KYCLevel.BASIC,
            INDONESIA,
            VALID_DAYS
        );
        kyc.pause();

        vm.expectRevert(KYCRegistry.ContractPaused.selector);
        kyc.updateInvestor(investor1, KYCRegistry.KYCLevel.VERIFIED);
    }

    function test_RevokeWorksWhilePaused() public {
        kyc.registerInvestor(
            investor1,
            KYCRegistry.KYCLevel.BASIC,
            INDONESIA,
            VALID_DAYS
        );
        kyc.pause();

        // Revoke should work even when paused (for emergencies)
        kyc.revokeInvestor(investor1);
        assertFalse(kyc.isVerified(investor1));
    }

    // ============================================
    // IS VERIFIED TESTS
    // ============================================

    function test_IsVerifiedReturnsTrueForActiveInvestor() public {
        kyc.registerInvestor(
            investor1,
            KYCRegistry.KYCLevel.BASIC,
            INDONESIA,
            VALID_DAYS
        );
        assertTrue(kyc.isVerified(investor1));
    }

    function test_IsVerifiedReturnsFalseForNonRegistered() public view {
        assertFalse(kyc.isVerified(investor1));
    }

    function test_IsVerifiedReturnsFalseForRevokedInvestor() public {
        kyc.registerInvestor(
            investor1,
            KYCRegistry.KYCLevel.BASIC,
            INDONESIA,
            VALID_DAYS
        );
        kyc.revokeInvestor(investor1);

        assertFalse(kyc.isVerified(investor1));
    }

    function test_IsVerifiedReturnsFalseAfterExpiry() public {
        kyc.registerInvestor(
            investor1,
            KYCRegistry.KYCLevel.BASIC,
            INDONESIA,
            VALID_DAYS
        );

        vm.warp(block.timestamp + VALID_DAYS * 1 days + 1);

        assertFalse(kyc.isVerified(investor1));
    }

    // ============================================
    // MEETS LEVEL TESTS
    // ============================================

    function test_MeetsLevelBasic() public {
        kyc.registerInvestor(
            investor1,
            KYCRegistry.KYCLevel.BASIC,
            INDONESIA,
            VALID_DAYS
        );

        assertTrue(kyc.meetsLevel(investor1, KYCRegistry.KYCLevel.BASIC));
        assertFalse(kyc.meetsLevel(investor1, KYCRegistry.KYCLevel.VERIFIED));
        assertFalse(kyc.meetsLevel(investor1, KYCRegistry.KYCLevel.ACCREDITED));
    }

    function test_MeetsLevelVerified() public {
        kyc.registerInvestor(
            investor1,
            KYCRegistry.KYCLevel.VERIFIED,
            INDONESIA,
            VALID_DAYS
        );

        assertTrue(kyc.meetsLevel(investor1, KYCRegistry.KYCLevel.BASIC));
        assertTrue(kyc.meetsLevel(investor1, KYCRegistry.KYCLevel.VERIFIED));
        assertFalse(kyc.meetsLevel(investor1, KYCRegistry.KYCLevel.ACCREDITED));
    }

    function test_MeetsLevelAccredited() public {
        kyc.registerInvestor(
            investor1,
            KYCRegistry.KYCLevel.ACCREDITED,
            INDONESIA,
            VALID_DAYS
        );

        assertTrue(kyc.meetsLevel(investor1, KYCRegistry.KYCLevel.BASIC));
        assertTrue(kyc.meetsLevel(investor1, KYCRegistry.KYCLevel.VERIFIED));
        assertTrue(kyc.meetsLevel(investor1, KYCRegistry.KYCLevel.ACCREDITED));
    }

    function test_MeetsLevelReturnsFalseForExpired() public {
        kyc.registerInvestor(
            investor1,
            KYCRegistry.KYCLevel.ACCREDITED,
            INDONESIA,
            VALID_DAYS
        );

        vm.warp(block.timestamp + VALID_DAYS * 1 days + 1);

        assertFalse(kyc.meetsLevel(investor1, KYCRegistry.KYCLevel.BASIC));
    }

    // ============================================
    // GET DAYS UNTIL EXPIRY TESTS
    // ============================================

    function test_GetDaysUntilExpiry() public {
        kyc.registerInvestor(
            investor1,
            KYCRegistry.KYCLevel.BASIC,
            INDONESIA,
            VALID_DAYS
        );

        uint256 daysLeft = kyc.getDaysUntilExpiry(investor1);
        assertEq(daysLeft, VALID_DAYS);
    }

    function test_GetDaysUntilExpiryReturnsZeroAfterExpiry() public {
        kyc.registerInvestor(
            investor1,
            KYCRegistry.KYCLevel.BASIC,
            INDONESIA,
            VALID_DAYS
        );

        vm.warp(block.timestamp + VALID_DAYS * 1 days + 1);

        assertEq(kyc.getDaysUntilExpiry(investor1), 0);
    }

    // ============================================
    // FUZZ TESTS
    // ============================================

    function testFuzz_RegisterInvestorValidDays(uint256 validDays) public {
        validDays = bound(validDays, 1, 3650);

        kyc.registerInvestor(
            investor1,
            KYCRegistry.KYCLevel.BASIC,
            INDONESIA,
            validDays
        );

        (, uint256 expiryDate, , ) = kyc.getInvestor(investor1);
        assertEq(expiryDate, block.timestamp + (validDays * 1 days));
    }

    function testFuzz_RegisterInvestorCountryCode(uint16 countryCode) public {
        kyc.registerInvestor(
            investor1,
            KYCRegistry.KYCLevel.BASIC,
            countryCode,
            VALID_DAYS
        );

        (, , uint16 savedCountryCode, ) = kyc.getInvestor(investor1);
        assertEq(savedCountryCode, countryCode);
    }

    function testFuzz_ExpiryTime(uint256 timeElapsed) public {
        kyc.registerInvestor(
            investor1,
            KYCRegistry.KYCLevel.BASIC,
            INDONESIA,
            VALID_DAYS
        );

        timeElapsed = bound(timeElapsed, 0, VALID_DAYS * 1 days * 2);

        vm.warp(block.timestamp + timeElapsed);

        bool expectedVerified = timeElapsed <= VALID_DAYS * 1 days;
        assertEq(kyc.isVerified(investor1), expectedVerified);
    }
}
