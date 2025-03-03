import { useEffect, useRef, useState } from "react";
import {
  SQLiteDBConnection,
  SQLiteConnection,
  CapacitorSQLite,
} from "@capacitor-community/sqlite";

const useSQLiteDB = () => {
  const db = useRef<SQLiteDBConnection>();
  const sqlite = useRef<SQLiteConnection>();
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    const initializeDB = async () => {
      if (sqlite.current) return;

      sqlite.current = new SQLiteConnection(CapacitorSQLite);
      const ret = await sqlite.current.checkConnectionsConsistency();
      const isConn = (await sqlite.current.isConnection("db_vite", false))
        .result;

      if (ret.result && isConn) {
        db.current = await sqlite.current.retrieveConnection("db_vite", false);
      } else {
        db.current = await sqlite.current.createConnection(
          "db_vite",
          false,
          "no-encryption",
          1,
          false
        );
      }

      // Only initialize tables after the DB is ready
      await initializeTables();
      setInitialized(true);
    };

    initializeDB().catch((error) => {
      console.error("Database initialization error:", error);
    });
  }, []);

  const performSQLAction = async (
    action: (db: SQLiteDBConnection | undefined) => Promise<void>,
    cleanup?: () => Promise<void>
  ) => {
    try {
      await db.current?.open();
      await action(db.current);
    } catch (error) {
      console.log((error as Error).message);
    } finally {
      try {
        if (await db.current?.isDBOpen()) {
          await db.current?.close();
        }
        cleanup && (await cleanup());
      } catch (closeError) {
        console.error("Error closing the database:", closeError);
      }
    }
  };

  const initializeTables = async () => {
    const queries = [
      `CREATE TABLE IF NOT EXISTS test (
          id INTEGER PRIMARY KEY NOT NULL,
          name TEXT NOT NULL
        );`,
      `CREATE TABLE IF NOT EXISTS User (
          id INTEGER PRIMARY KEY NOT NULL,
          fname TEXT NOT NULL,
          lname TEXT NOT NULL,
          pincode INTEGER
        );`,
      `CREATE TABLE IF NOT EXISTS Animal_Type (
          id INTEGER PRIMARY KEY NOT NULL,
          type TEXT NOT NULL,
          gestation_period INTEGER
        );`,
      `CREATE TABLE IF NOT EXISTS Breed (
          id INTEGER PRIMARY KEY NOT NULL,
          breed TEXT NOT NULL,
          Animal_Type_id INTEGER
        );`,
        
        `CREATE TABLE IF NOT EXISTS Animal (
          id INTEGER PRIMARY KEY NOT NULL,
          breed_id INTEGER, 
          gender TEXT NOT NULL,
          birthdate TEXT NOT NULL, 
          health_status_id INTEGER NOT NULL,
          pregnancy_status INTEGER NOT NULL,
          name TEXT NOT NULL,
          animal_father_id INTEGER, 
          animal_mother_id INTEGER,
          archive INTEGER
        );`,

        `CREATE TABLE IF NOT EXISTS Health_Status (
          id INTEGER PRIMARY KEY NOT NULL, 
          status TEXT NOT NULL
        );`,
        `DELETE FROM Health_Status`,
        `INSERT OR IGNORE INTO Health_Status (status) VALUES ("Healthy"), ("Sick"); `,

        `CREATE TABLE IF NOT EXISTS Person(
          id INTEGER PRIMARY KEY NOT NULL,
          fname TEXT NOT NULL,
          lname TEXT NOT NULL, 
          role_id INTEGER
        )`,

        `CREATE TABLE IF NOT EXISTS Role (
          id INTEGER PRIMARY KEY NOT NULL,
          role TEXT NOT NULL
        )`,

        `DELETE FROM Role`,

        `INSERT OR IGNORE INTO Role (role) VALUES ("Veterenary"), ("Breeder")`,

        `CREATE TABLE IF NOT EXISTS Vaccine_Supplement (
          id INTEGER PRIMARY KEY NOT NULL,
          Vaccine_Supplement TEXT NOT NULL,
          remedy_id INTEGER
        )`,

        `CREATE TABLE IF NOT EXISTS Remedy(
          id INTEGER PRIMARY KEY NOT NULL, 
          remedy TEXT NOT NULL
        )`,

        `DELETE FROM Remedy`,
        `INSERT OR IGNORE INTO Remedy (remedy) VALUES ("Vaccine"), ("Supplement")`,

        `CREATE TABLE IF NOT EXISTS Feeds(
          id INTEGER PRIMARY KEY NOT NULL,
          feeds TEXT NOT NULL 
        )`, 

        `CREATE TABLE IF NOT EXISTS Feed_Animal_Header(
          id INTEGER PRIMARY KEY NOT NULL,
          animal_id INTEGER NOT NULL, 
          dateCreated TEXT NOT NULL
        )`,

        `CREATE TABLE IF NOT EXISTS Feed_Animal_Details_Feeds(
          id INTEGER PRIMARY KEY NOT NULL,
          Feed_Animal_Header INTEGER NOT NULL, 
          feeds_id INTEGER NOT NULL, 
          feeds_remarks TEXT NOT NULL,
          status INTEGER NOT NULL,
          dateCreated TEXT NOT NULL
        )`,

        `CREATE TABLE IF NOT EXISTS Feed_Animal_Details_Supplement(
          id INTEGER PRIMARY KEY NOT NULL,
          Feed_Animal_Header INTEGER NOT NULL, 
          Vaccine_Supplement_id INTEGER NOT NULL, 
          Supplement_Remarks TEXT,
          status INTEGER NOT NULL,
          dateCreated TEXT NOT NULL
        )`,

        `CREATE TABLE IF NOT EXISTS Disease (
          id INTEGER PRIMARY KEY NOT NULL, 
          disease TEXT NOT NULL
        )`,

        `CREATE TABLE IF NOT EXISTS Disease_Animal_Header (
          id INTEGER PRIMARY KEY NOT NULL,
          animal_id INTEGER NOT NULL, 
          dateCreated TEXT NOT NULL, 
          status INTEGER NOT NULL, 
          dateCured TEXT NOT NULL, 
          vet_id INTEGER NOT NULL
        )`,
        
        `CREATE TABLE IF NOT EXISTS Disease_Animal_Detail (
          id INTEGER PRIMARY KEY NOT NULL, 
          disease_animal_header_id INTEGER NOT NULL, 
          vaccine_supplement_id INTEGER NOT NULL,
          remarks TEXT NOT NULL,
          dateCreated TEXT NOT NULL,
          status INTEGER NOT NULL,
          disease_id INTEGER NOT NULL
        )`,

        
        `CREATE TABLE IF NOT EXISTS Estrus_Head (
          id INTEGER PRIMARY KEY NOT NULL, 
          animal_id INTEGER NOT NULL, 
          dateCreated TEXT NOT NULL,
          archive INTEGER NOT NULL,
          status TEXT NOT NULL
        )`,

        `CREATE TABLE IF NOT EXISTS Estrus_Details (
          id INTEGER PRIMARY KEY NOT NULL, 
          Estrus_Head INTEGER NOT NULL, 
          Breeder_Date TEXT NOT NULL, 
          animal_id_male INTEGER NOT NULL, 
          type TEXT NOT NULL, 
          status TEXT NOT NULL, 
          breeder_id INTEGER NOT NULL, 
          remarks TEXT,
          archive INTEGER NOT NULL
        )`,
    

        `CREATE TABLE IF NOT EXISTS Pregnancy (
          id INTEGER PRIMARY KEY, 
          estrus_details_id INTEGER NOT NULL,
          dateConfirmed TEXT NOT NULL, 
          ExpDueDate TEXT NOT NULL, 
          ActualDueDate TEXT NOT NULL, 
          status TEXT NOT NULL,
          dateFailed TEXT NOT NULL,
          archive INTEGER NOT NULL
        )`,
        
        `CREATE TABLE IF NOT EXISTS Birth_Pregnanc_Head (
          id INTEGER PRIMARY KEY, 
          pregnancy_id INTEGER NOT NULL, 
          actualDate TEXT NOT NULL, 
          OffspringNum INTEGER NOT NULL, 
          DeadNum INTEGER NOT NULL,
          AliveNum INTEGER NOT NULL, 
          SexMnum INTEGER NOT NULL, 
          SexFNum INTEGER NOT NULL
        )`,

        `CREATE TABLE IF NOT EXISTS Birth_Pregnanc_Details (
          id INTEGER PRIMARY KEY,
          Birth_Pregnancy_Head INTEGER NOT NULL, 
          animal_id INTEGER NOT NULL,
          sex TEXT NOT NULL,
          Health_Status_id INTEGER NOT NULL 
        )`
    ];

//INSERT IGNORE INTO Animal (breed_id, gender, birthdate, health_status_id, pregnancy_status, name) VALUES (1, "Male", "12/31/2001", 1, 0, "Cute_Neil")
    for (const query of queries) {
      await performSQLAction(async (db) => {
        const respCT = await db?.execute(query);
        console.log(`Execution response: ${JSON.stringify(respCT)}`);
      });
    }
  };

  return { performSQLAction, initialized };
};

export default useSQLiteDB;
