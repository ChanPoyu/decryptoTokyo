pragma solidity ^0.5.0;
import './HachiToken.sol';


contract mapProject is HachiToken{

    address owner;
    uint private totalReward;
    uint[4] private contractGeoCoord;

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
    constructor (uint _totalReward, uint[] memory _coord) public {
        totalReward = _totalReward;
        
        for(uint i = 0; i < 4; i ++){
            contractGeoCoord[i] = _coord[i];
        } 
        
        owner = msg.sender;

        approve(owner, totalReward);
        mint(owner, totalReward);
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

    function getContractGeoCoord () public view returns(uint[4] memory){
        return contractGeoCoord;
    }

    // reward methods
    function payReward() private {
        
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

        uint256 averageReward = div(totalReward, posterAdrressArr.length);

        // reward send to poster
        sendReward(posterAdrressArr, averageReward);

        deletePost();
    }

    function deletePost() private {
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

    function sendReward(address[] memory _posterAdrressArr, uint256 _rewardAmount) internal {
        for(uint i = 0; i < _posterAdrressArr.length; i ++){
            transferFrom(owner, _posterAdrressArr[i], _rewardAmount);
        }
    }

}