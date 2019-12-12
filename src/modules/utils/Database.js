import SQLite from "react-native-sqlite-storage";
SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = "Reactoffline.db";
const database_version = "1.0";
const database_displayname = "SQLite React Offline Database";
const database_size = 200000;

export default class Database {

  initDB() {
    let db;
    return new Promise((resolve) => {
      console.log("Plugin integrity check ...");
      SQLite.echoTest()
        .then(() => {
          console.log("Integrity check passed ...");
          console.log("Opening database ...");
          SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size
          )
            .then(DB => {
              db = DB;
              console.log("Database OPEN");
              db.executeSql('SELECT 1 FROM Rating LIMIT 1').then(() => {
                  console.log("Database is ready ... executing query ...");
              }).catch((error) =>{
                  console.log("Received error: ", error);
                  console.log("Database not yet ready ... populating data");
                  db.transaction((tx) => {
                      tx.executeSql(
                        'CREATE TABLE IF NOT EXISTS Rating (location_id, rating, employee_id, skill_id, dropout_page, feedback, customer_name, is_standout, customer_phone, customer_email)',
                      );
                  }).then(() => {
                      console.log("Table created successfully");
                  }).catch(error => {
                      console.log(error);
                  });
              });
              resolve(db);
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(error => {
          console.log("echoTest failed - plugin not functional");
        });
      });
  };

  closeDatabase(db) {
    if (db) {
      console.log("Closing DB");
      db.close()
        .then(status => {
          console.log("Database CLOSED");
        })
        .catch(error => {
          this.errorCB(error);
        });
    } else {
      console.log("Database was not OPENED");
    }
  };

  listProduct() {
    return new Promise((resolve) => {
      const products = [];
      this.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql(
            'SELECT p.location_id, p.employee_id, p.rating, p.customer_name FROM Rating p',
            [],
          ).then(([tx, results]) => {
            console.log('Query completed');
            var len = results.rows.length;
            for (let i = 0; i < len; i++) {
              let row = results.rows.item(i);
              console.log(
                `Prod ID: ${row.location_id}, Prod Name: ${row.employee_id}`,
              );
              const {location_id, employee_id, rating} = row;
              products.push({
                location_id,
                employee_id,
                rating,
              });
            }
            console.log(products);
            resolve(products);
          });
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });  
  }

  productById(id) {
    console.log(id);
    return new Promise((resolve) => {
      this.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT * FROM Rating WHERE location_id = ?', [id]).then(
            ([tx, results]) => {
              console.log(results);
              if (results.rows.length > 0) {
                let row = results.rows.item(0);
                resolve(row);
              }
            },
          );
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });  
  }

  addProduct(prod) {
    return new Promise((resolve) => {
      this.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('INSERT INTO Rating VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
            prod.location_id,
            prod.rating,
            prod.employee_id,
            prod.skill_id,
            prod.dropout_page,
            prod.feedback,
            prod.customer_name,
            prod.is_standout,
            prod.customer_phone,
            prod.customer_email,
          ]).then(([tx, results]) => {
            resolve(results);
          });
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });  
  }

  updateProduct(id, prod) {
    return new Promise((resolve) => {
      this.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql(
            'UPDATE Rating SET employee_id = ?, rating = ?, skill_id = ?, dropout_page = ?, feedback = ?, is_standout, customer_phone, customer_email = ? WHERE location_id = ?',
            [
              prod.employee_id,
              prod.rating,
              prod.rating,
              prod.dropout_page,
              prod.feedback,
              prod.is_standout,
              prod.customer_phone,
              prod.customer_email,
              id,
            ],
          ).then(([tx, results]) => {
            resolve(results);
          });
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });  
  }

  deleteProduct(id) {
    return new Promise((resolve) => {
      this.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('DELETE FROM Rating WHERE location_id = ?', [id]).then(
            ([tx, results]) => {
              console.log(results);
              resolve(results);
            },
          );
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });  
  }
}
