pragma solidity ^0.5.0;

contract mapProject{

    address owner;
    uint public totalReward;

    struct Post{
        address posterAddress;
        string imageHash;
        string ipAddressHash;
        int[4] geoCoordinate;
    }

    event newPostAdded(address posterAdrress, string imageHash);
    event postDeleted(bool isDeleted);

    Post[] Posts;

    address[] posterAdrressArr;

    // constructor
    constructor (uint _totalReward) public {
        totalReward = _totalReward;
        owner = msg.sender;
    }

    // set new post to project
    function addPost(address _posterAdrress, string memory _imageHash, string memory _ipAddressHash, int[] memory _geoCoordinate) public {
        Post memory newpost;

        newpost.posterAddress = _posterAdrress;
        newpost.imageHash = _imageHash;
        newpost.ipAddressHash = _ipAddressHash;
        for(uint i = 0; i < _geoCoordinate.length; i ++){
            newpost.geoCoordinate[i] = _geoCoordinate[i];
        }

        Posts.push(newpost);

        emit newPostAdded(newpost.posterAddress, newpost.imageHash);
    }

    // get total reward

    function getTotalReward () public view returns(uint){
        return totalReward;
    }

    // reward methods
    function payReward() public {
        
       bool addressExist = false;

       for(uint i = 0; i < Posts.length; i++){
            for(uint j = 0; j < posterAdrressArr.length; j ++){
                if(Posts[i].posterAddress == posterAdrressArr[j]){
                    addressExist = true;
                }
            }
            if(addressExist == false){
                posterAdrressArr.push(Posts[i].posterAddress);
            }
        }

        // uint256 averageReward = div(totalReward, posterAdrressArr.length);

        // reward send to poster
        // sendReward(averageReward);

        deletePost();
    }

    function deletePost() internal {
        delete Posts;
        emit postDeleted(Posts.length == 0);
    }
    
    
    // save math from open zepplin
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // Solidity only automatically asserts when dividing by 0
        require(b > 0, "SafeMath: division by zero");
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    // function sendReward(address[] _posterAdrressArr) internal {
        
    // }

}