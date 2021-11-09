//Cart constractor
module.exports = function Cart(oldCart)  //Cart included items and each item is the product. the cart contains items' parameters such as cost
{
  this.items = oldCart.items || {};
  this.totalQty=oldCart.totalQty || 0;
  this.totalPrice=oldCart.totalPrice || 0;
  this.add=function(item,id)
  {
      let storedItem = this.items[id];
      if (!storedItem) // if there is no stored item
      {
          storedItem = this.items[id] = {item: item, qty:0 , price:0}; //id == key in collection.
      }
      storedItem.qty++;
      storedItem.price = storedItem.item.price*storedItem.qty; //Measure items*amount_of_items
      this.totalQty++;
      this.totalPrice+=storedItem.item.price;
  };

  this.reduceByOne=function (id)
  {
      this.items[id].qty--; //decrease number of qty
      this.items[id].price -=this.items[id].item.price; // decrease the price of item 
      this.totalQty--; //decrease number of total qty
      this.totalPrice -= this.items[id].item.price; //decrease total price

      if(this.items[id].qty<=0){ //delete the item that we will not have - value of qty and the user can get movey from the system
        delete this.items[id];
      }
  };

  this.removeItem=function (id)
  {
      this.totalQty-=this.items[id].qty; //decrease number of total qty to 0 by items[id].qty
      this.totalPrice-=this.items[id].price; //decrease total price to 0
      delete this.items[id];
  };

  this.generateArray = function()
  {
    let array =[];
    for (let id in this.items)
    {
        array.push(this.items[id]);
    }
    return array;
  };
};