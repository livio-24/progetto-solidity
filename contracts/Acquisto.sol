// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";




contract Acquisto is ERC721, Ownable{
    address private Owner;
    address[16] private buyers;
    event NFTMinted(address a,uint256 b);
    event transferEff(address a,address b);
    mapping(uint256 => uint256) private prezzi;
    mapping(uint256 => bool) private acquistato;


    //Return True se il sender e' l'owner del contratto, false altrimenti
    function isOwner() internal view returns(bool) {
      return owner() == msg.sender; 
   }

    //Cambia il proprietario del contratto
   function change_owner(address newOwner) public onlyOwner returns (address){
      _transferOwnership(newOwner);
      return newOwner;
   }

    //Funzione che crea le 16 NFT (quadri)
    function createNFTS() public onlyOwner {
        for (uint256 i = 0; i < 16; i++) 
            {
                _safeMint(Owner, i);
                prezzi[i]=10;
                acquistato[i]=false;
                emit NFTMinted(Owner,i);
                }
    }

    //Funzione che trasferisce un Token ad un Utente
   function trasferimento(address to, uint idOpera) public  payable  returns (address) {
        require(msg.value >= prezzi[idOpera], "La somma mandata non e' sufficiente"); 
        require(acquistato[idOpera]==false, "Il quadro e' gia' stato acquistato"); 
        payable(Owner).transfer(msg.value);
        _transfer(Owner, to, idOpera); 
        emit transferEff(Owner,to); 
        buyers[idOpera] = to;
        acquistato[idOpera]=true;
        address tr=to;
        return tr;            
   }

    //Funzione che restituisce un vettore che rappresenta chi possiede un'opera 
   function getBuyers() public view returns (address[16] memory) {
      return buyers;
   }

    //costruttore
   constructor(string memory name, string memory symbol)ERC721(name, symbol) {
        Owner = msg.sender;
        createNFTS();
        }
}
