import { FlatList, View } from 'react-native';

import MarketCard from './MarketCard'

export default function MarketPage({cardList, setTerm, activeTerm}) {
    return (
        /* 
            To render multiple similar components 
            data loops through all cardList
            each element in cardList is assigned to item
            so we use item to retrieve the card data
        */
       <View>
          <FlatList data={cardList} renderItem={ ({item}) => {

            return (
              <MarketCard 
                  name={item.name}
                  active={item.name === activeTerm} //if the state term mathces the name then the card needs to be active
                  handlePress=
                  {()=> 
                    setTerm(item.name)
                    
                }
              />
            )
            } }
            // align the components horizontally
            horizontal
            // uniquely identify each element to enhance performance
            keyExtractor={(category) => category.name}

          />
       </View>
        
    
    )
}