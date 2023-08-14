// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

// ==============================================
// $$\   $$\  $$$$$$\  $$\    $$$$$$$$\  $$$$$$\  
// $$ |  $$ |$$  __$$\ $$ |   \__$$  __|$$  __$$\ 
// \$$\ $$  |$$ /  $$ |$$ |      $$ |   $$ /  \__|
//  \$$$$  / $$$$$$$$ |$$ |      $$ |   \$$$$$$\  
//  $$  $$<  $$  __$$ |$$ |      $$ |    \____$$\ 
// $$  /\$$\ $$ |  $$ |$$ |      $$ |   $$\   $$ |
// $$ /  $$ |$$ |  $$ |$$$$$$$$\ $$ |   \$$$$$$  |
// \__|  \__|\__|  \__|\________|\__|    \______/ 
// ==============================================                                                     
                                                                      
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";                                                       

interface IERC20 {
  
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 value) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

interface IERC20Metadata is IERC20 {
  
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
}

interface IERC20Errors {

    error ERC20InsufficientBalance(address sender, uint256 balance, uint256 needed);
    error ERC20InvalidSender(address sender);
    error ERC20InvalidReceiver(address receiver);
    error ERC20InsufficientAllowance(address spender, uint256 allowance, uint256 needed);
    error ERC20InvalidApprover(address approver);
    error ERC20InvalidSpender(address spender);
}

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

/**
 * @title XALTS token
 * @dev Implementation of the basic standard ERC20 token.
 */
contract XALTS is Context, IERC20, IERC20Metadata, IERC20Errors {
    uint256 private _totalSupply;
    string private _name;
    string private _symbol;
    mapping(address account => uint256) private _balances;
    mapping(address account => mapping(address spender => uint256)) private _allowances;
    mapping(address => bool) public isWhitelisted;
    mapping(address => bool) public isBlacklisted;
    address public owner;
    address[] wallets; // Should use if there are less number of wallets (5 numbers here), if there are more (like 1000), use MerkleProof, (https://github.com/miguelmota/merkletreejs)
    mapping(address => address[]) private interactions; // Mapping of wallet to its interactions
    bytes32 public root;
    uint256 public price;
    bool internal locked;

    event WalletBlacklisted(address indexed wallet);
    event WalletWhitelisted(address indexed wallet);

    error ERC20FailedDecreaseAllowance(address spender, uint256 currentAllowance, uint256 requestedDecrease);

    // Merkle Root: 0xc20533a30272aa04ee4a0b771b9bec3f908daa9e434f89c9191b8f091e8730ff

    // Merkle Tree: 
    //  └─ c20533a30272aa04ee4a0b771b9bec3f908daa9e434f89c9191b8f091e8730ff
    //    ├─ eb3a2f99a8285c07f29f7cbb4d8c801b71443768eeb16fbf0f3701844ecb8099
    //    │  ├─ 961fe4bd97c3519f812e8594651b32e600beed1b715d65a46146be4eac495384
    //    │  │  ├─ 37a880f6494073e762e636484d3a17b2dcf4c1b908e43e9d23e061293d791ec6
    //    │  │  └─ 64d9de402c07b04e1f2d43cb45cc42be09a0e058bb9d3e3286f6b8d13933d698
    //    │  └─ 5cc51042e94169408398c53185f32e1f02320e3da3ba4fca34f0cf75674909af
    //    │     ├─ 18c1869c7f8446259dd30c193a48668bea0445347c888838b25f298aa5aac49d
    //    │     └─ 4e21ce73d6ed61b89296c5a80ae037591d30db2394f604ae236cf0910c500422
    //    └─ db6e810e8886eaedbb0b6aeb937583e75037dbc11f3c2488ac00f9df1ba7bd2f
    //       └─ db6e810e8886eaedbb0b6aeb937583e75037dbc11f3c2488ac00f9df1ba7bd2f
    //          └─ db6e810e8886eaedbb0b6aeb937583e75037dbc11f3c2488ac00f9df1ba7bd2f
    constructor(string memory name_, string memory symbol_, uint256 _price, bytes32 _root, address[] memory _wallet) {
        _name = name_;
        _symbol = symbol_;
        owner = _msgSender();
        price = _price * (10**18) / (10 ** 4);
        root = _root;
        wallets = _wallet;
        whitelist(_wallet);
        _mint(_msgSender(), 1_000_000 * (10**decimals()));
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner or issuer can call this function");
        _;
    }

    modifier onlyWhitelisted() {
        require(isWhitelisted[msg.sender] == true, "Only whitelisted wallet can call this function");
        _;
    }

    modifier noReentrant() {
        require(!locked, "cannot reenter");
        locked = true;
        _;
        locked = false;
    }

    /**
    * @dev Get whitelisted address from Merkle Proof
    * @param wallet address The address which you want to send tokens from
    * @param proof address The address which you want to transfer to
    * @return Returns True or False
    */
    function isValidWhitelistAddress(address wallet, bytes32[] memory proof) public view returns (bool) {
        bytes32 leaf = keccak256(abi.encodePacked(wallet));
        return MerkleProof.verify(proof, root, leaf);
    }

    function isWhitelistedAddress(address wallet) public view returns (bool) {
        return isWhitelisted[wallet];
    }

    function isBlacklistedAddress(address wallet) public view returns (bool) {
         return isBlacklisted[wallet];
    }

    function addWalletAddress(address[] memory _wallet) public onlyOwner {
        for (uint256 i = 0; i < _wallet.length; i++) { 
            wallets.push(_wallet[i]);
        }
    }

    function walletAddressList() public view returns (address[] memory, uint256 length) {
        return (wallets, wallets.length);
    }

    function setPrice(uint256 _price) public onlyOwner {
        price = _price;
    }

    function purchaseTokens(uint256 amountToPurchase) public payable onlyWhitelisted noReentrant {
        require(msg.value >= (amountToPurchase * price / (10**decimals())), "Ether sent is less than required amount");
        (bool sent, ) = owner.call{value: msg.value}("");
        require(sent, "Failure! Ether not sent");
        _mint(msg.sender, amountToPurchase);
    }

    function whitelist(address[] memory _wallet) public onlyOwner {
        for (uint i = 0; i < _wallet.length; i++) {
            isWhitelisted[_wallet[i]] = true;
            isBlacklisted[_wallet[i]] = false;
            emit WalletWhitelisted(_wallet[i]);

            // Whitelist all connected peers that were blacklisted because of this wallet
            address[] memory peers = interactions[_wallet[i]];
            for (uint256 j = 0; j < peers.length; j++) {
                isBlacklisted[peers[i]] = false;
                isWhitelisted[peers[i]] = true;
                emit WalletWhitelisted(peers[i]);
            }
        }
    }

    function blacklist(address[] memory _wallet) public onlyOwner {
        for (uint i = 0; i < _wallet.length; i++) {
            isWhitelisted[_wallet[i]] = false;
            isBlacklisted[_wallet[i]] = true;
            emit WalletBlacklisted(_wallet[i]);

            // Blacklist all connected peers
            address[] memory peers = interactions[_wallet[i]];
            for (uint256 j = 0; j < peers.length; j++) {
                isBlacklisted[peers[i]] = true;
                isWhitelisted[peers[i]] = false;
                emit WalletBlacklisted(peers[i]);
            }
        }  
    }

    function name() public view virtual returns (string memory) {
        return _name;
    }

    function symbol() public view virtual returns (string memory) {
        return _symbol;
    }

    function decimals() public view virtual returns (uint8) {
        return 18;
    }

    function totalSupply() public view virtual returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view virtual returns (uint256) {
        return _balances[account];
    }

    function transfer(address to, uint256 amount) public virtual returns (bool) {
        address sender = _msgSender();
        if(sender == owner && isWhitelisted[to]) {
            _transfer(sender, to, amount);
            return true;
        } else if (sender == owner && isBlacklisted[to]){
            revert ("Recipient is Blacklisted");
        }
        interactions[to].push(sender);
        if(isBlacklisted[to] == true) {
            isBlacklisted[sender] == true;
            isWhitelisted[sender] == false;
            return true;
        }
        require(isWhitelisted[sender], "Sender is not whitelisted");
        require(isWhitelisted[to], "Recipient is not whitelisted");
        require(balanceOf(sender) >= amount, "Insufficient balance");
        // Additional checks
        require(!isBlacklisted[sender] && !isBlacklisted[to], "Either sender or recipient is blacklisted");
        _transfer(sender, to, amount);
         interactions[sender].push(to);
        return true;
    }

    function allowance(address _owner, address spender) public view virtual returns (uint256) {
        return _allowances[_owner][spender];
    }

    function approve(address spender, uint256 value) public virtual returns (bool) {
        address sender = _msgSender();
        if(sender == owner && isWhitelisted[spender]) {
            _approve(sender, spender, value);
            return true;
        } else if (sender == owner && isBlacklisted[spender]){
            revert ("Spender is Blacklisted");
        }
        interactions[spender].push(sender);
        require(isWhitelisted[sender] == true, "Approver is blacklisted");
        if(isBlacklisted[spender] == true) {
            isBlacklisted[sender] == true;
            isWhitelisted[sender] == false;
            return true;
        }
        _approve(sender, spender, value);
        interactions[sender].push(spender);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) public virtual returns (bool) {
        address spender = _msgSender();
        if(spender == owner && isWhitelisted[to]) {
            _spendAllowance(from, spender, value);
            _transfer(from, to, value);
            return true;
        } else if (spender == owner && isBlacklisted[to]){
            revert ("Recipient is Blacklisted");
        }
        interactions[to].push(spender);
        if(isBlacklisted[to] == true) {
            isBlacklisted[spender] == true;
            isWhitelisted[spender] == false;
            return true;
        }
        _spendAllowance(from, spender, value);
        _transfer(from, to, value);
        interactions[spender].push(to);
        return true;
    }

    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        address sender = _msgSender();
        if(sender == owner && isWhitelisted[spender]) {
            _approve(sender, spender, allowance(owner, spender) + addedValue);
            return true;
        } else if (sender == owner && isBlacklisted[spender]){
            revert ("Spender is Blacklisted");
        }
        interactions[spender].push(sender);
        require(isWhitelisted[sender] == true, "Sender is blacklisted");
        if(isBlacklisted[spender] == true) {
            isBlacklisted[sender] == true;
            isWhitelisted[sender] == false;
            return true;
        }
        _approve(sender, spender, allowance(owner, spender) + addedValue);
        interactions[sender].push(spender);
        return true;
    }

    function decreaseAllowance(address spender, uint256 requestedDecrease) public virtual returns (bool) {
        address sender = _msgSender();
        if(sender == owner && isWhitelisted[spender]) {
            uint256 currentAllowances = allowance(sender, spender);
            if (currentAllowances < requestedDecrease) {
                revert ERC20FailedDecreaseAllowance(spender, currentAllowances, requestedDecrease);
            }
            unchecked {
                _approve(owner, spender, currentAllowances - requestedDecrease);
            }
            return true;
        } else if (sender == owner && isBlacklisted[spender]){
            revert ("Spender is Blacklisted");
        }
        interactions[spender].push(sender);
        require(isWhitelisted[sender] == true, "Sender is blacklisted");
        if(isBlacklisted[spender] == true) {
            isBlacklisted[sender] == true;
            isWhitelisted[sender] == false;
            return true;
        }
        uint256 currentAllowance = allowance(sender, spender);
        if (currentAllowance < requestedDecrease) {
            revert ERC20FailedDecreaseAllowance(spender, currentAllowance, requestedDecrease);
        }
        unchecked {
            _approve(owner, spender, currentAllowance - requestedDecrease);
        }
        interactions[sender].push(spender);

        return true;
    }

    function mint(address account, uint256 amountToMint) public onlyOwner {
        require(amountToMint > 0, "Mint amount shouldn't be zero");
        _mint(account, amountToMint);
    }

    function _transfer(address from, address to, uint256 value) internal {
        if (from == address(0)) {
            revert ERC20InvalidSender(address(0));
        }
        if (to == address(0)) {
            revert ERC20InvalidReceiver(address(0));
        }
        _update(from, to, value);
    }

    function _update(address from, address to, uint256 value) internal virtual {
        if (from == address(0)) {
            // Overflow check required: The rest of the code assumes that totalSupply never overflows
            _totalSupply += value;
        } else {
            uint256 fromBalance = _balances[from];
            if (fromBalance < value) {
                revert ERC20InsufficientBalance(from, fromBalance, value);
            }
            unchecked {
                // Overflow not possible: value <= fromBalance <= totalSupply.
                _balances[from] = fromBalance - value;
            }
        }

        if (to == address(0)) {
            unchecked {
                // Overflow not possible: value <= totalSupply or value <= fromBalance <= totalSupply.
                _totalSupply -= value;
            }
        } else {
            unchecked {
                // Overflow not possible: balance + value is at most totalSupply, which we know fits into a uint256.
                _balances[to] += value;
            }
        }

        emit Transfer(from, to, value);
    }

    function _mint(address account, uint256 value) internal {
        if (account == address(0)) {
            revert ERC20InvalidReceiver(address(0));
        }
        _update(address(0), account, value);
    }

    function _burn(address account, uint256 value) internal {
        if (account == address(0)) {
            revert ERC20InvalidSender(address(0));
        }
        _update(account, address(0), value);
    }

    function _approve(address _owner, address spender, uint256 value) internal virtual {
        _approve(_owner, spender, value, true);
    }

    function _approve(address _owner, address spender, uint256 value, bool emitEvent) internal virtual {
        if (_owner == address(0)) {
            revert ERC20InvalidApprover(address(0));
        }
        if (spender == address(0)) {
            revert ERC20InvalidSpender(address(0));
        }
        _allowances[owner][spender] = value;
        if (emitEvent) {
            emit Approval(owner, spender, value);
        }
    }

    function _spendAllowance(address _owner, address spender, uint256 value) internal virtual {
        uint256 currentAllowance = allowance(_owner, spender);
        if (currentAllowance != type(uint256).max) {
            if (currentAllowance < value) {
                revert ERC20InsufficientAllowance(spender, currentAllowance, value);
            }
            unchecked {
                _approve(owner, spender, currentAllowance - value, false);
            }
        }
    }
}