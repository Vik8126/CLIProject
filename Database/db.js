import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

export const getDBConnection = async () => {
  return await SQLite.openDatabase({name: 'mydb.db', location: 'default'});
};

export const createUserTable = async db => {
  await db.executeSql(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT
      );
    `);
};

export const registerUser = async (db, email, password) => {
  await db.executeSql('INSERT INTO users (email, password) VALUES (?, ?);', [
    email,
    password,
  ]);
};

export const loginUser = async (db, email, password) => {
  const results = await db.executeSql(
    'SELECT * FROM users WHERE email = ? AND password = ?;',
    [email, password],
  );
  return results[0].rows.length > 0 ? results[0].rows.item(0) : null;
};

export const createTable = async db => {
  const query = `CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT
  );`;
  await db.executeSql(query);
};

export const createTables = async db => {
  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        access_token TEXT,
        refresh_token TEXT,
        expires_at INTEGER
      );`,
  );
};

export const saveToken = async (db, accessToken, refreshToken, expiresAt) => {
  await db.executeSql('DELETE FROM tokens;'); // Optional: remove old token
  await db.executeSql(
    'INSERT INTO tokens (access_token, refresh_token, expires_at) VALUES (?, ?, ?);',
    [accessToken, refreshToken, expiresAt],
  );
};
  
export const getToken = async db => {
  const results = await db.executeSql('SELECT * FROM tokens LIMIT 1;');
  if (results[0].rows.length > 0) {
    return results[0].rows.item(0);
  }
  return null;
};
  


  export const addItem = async (db, name, description) => {
    await db.executeSql('INSERT INTO items (name, description) VALUES (?, ?);', [name, description]);
  };

  export const getItems = async db => {
    try {
      const results = await db.executeSql('SELECT * FROM items;');
      const items = [];

      // results is an array of [ResultSet]
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const rows = result.rows;

        for (let j = 0; j < rows.length; j++) {
          items.push(rows.item(j));
        }
      }

      return items;
    } catch (error) {
      console.error('Failed to get items from database:', error);
      return [];
    }
  };
  

  export const updateItem = async (db, id, name, description) => {
    await db.executeSql('UPDATE items SET name = ?, description = ? WHERE id = ?;', [name, description, id]);
  };

  export const deleteItem = async (db, id) => {
    await db.executeSql('DELETE FROM items WHERE id = ?;', [id]);
  };
