import "./IERC20.sol";

contract ERC20 is IERC20 {
    mapping (address => uint256) public override balanceOf;

    mapping (address => mapping (address => uint256)) public override allowance;

    uint256 public override totalSupply;

    string public name;

    string public symbol;
    
    constructor(string memory name_, string memory symbol_) {
        name = name_;
        symbol = symbol_;
    }

    // function totalSupply() external view override returns (uint256) {}

    // function balanceOf(
    //     address account
    // ) external view override returns (uint256) {}

    function transfer(
        address to,
        uint256 amount
    ) external override returns (bool) {
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
    }

    function approve(
        address spender,
        uint256 amount
    ) external override returns (bool) {
        allowance[msg.sender][spender] += amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external override returns (bool) {
        allowance[from][msg.sender] -= amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        emit Transfer(from, to, amount);
        return true;
    }
}