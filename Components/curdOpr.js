import React, {useEffect, useState} from 'react';
import {View, Button, TextInput, FlatList, Text} from 'react-native';
import {getDBConnection, createTable, addItem, getItems} from '../Database/db';

export default function curdOpr() {
  const [db, setDb] = useState(null);
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    async function initDb() {
      const dbConn = await getDBConnection();
      await createTable(dbConn);
      setDb(dbConn);
      const allItems = await getItems(dbConn);
      setItems(allItems);
    }
    initDb();
  }, []);

  const handleAdd = async () => {
    await addItem(db, name, desc);
    const allItems = await getItems(db);
    console.log('All items after insert:', allItems); // ✅ Debug
    setItems(allItems);
    setName('');
    setDesc('');
  };
  
  return (
    <View>
      <TextInput placeholder="Name" value={name} onChangeText={setName} />
      <TextInput
        placeholder="Description"
        value={desc}
        onChangeText={setDesc}
      />
      <Button title="Add Item" onPress={handleAdd} />
      <FlatList
        data={items}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <Text>
            {item.name} - {item.description}
          </Text>
        )}
      />
    </View>
  );
}
