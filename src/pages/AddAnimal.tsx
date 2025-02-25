import { IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonCol, IonContent, IonDatetime, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonMenuButton, IonModal, IonPage, IonRefresher, IonRefresherContent, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar, useIonAlert, RefresherEventDetail, IonTabs, IonTab, IonTabBar, IonTabButton, IonItemSliding, IonItemOption, IonItemOptions, IonGrid  } from "@ionic/react";
import { add, alertOutline, bonfireOutline, checkmark, chevronBackCircleOutline, chevronBackOutline, closeOutline, constructOutline, createOutline, downloadOutline, fastFoodOutline, happyOutline, listOutline, male, medkitOutline, save, saveOutline } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import Header from "./Header";
import SideBar from "./SideBar";
import Animal from "./Animal";
import AddAnimalType from "./AddAnimalType";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import useSQLiteDB from "../composables/useSQLiteDB";
import Barcode from "react-barcode";
import html2canvas from 'html2canvas'
import { Directory, Filesystem } from "@capacitor/filesystem";
import Estrus from "./Estrus";
import LiveStock_Feed from "./LiveStock_Feed";
import { useParams } from "react-router";
import { trashOutline } from "ionicons/icons";


type Animal = {
  id: number, 
  breed_id: number, 
  breed: string, 
  gender: string, 
  birthdate: string, 
  health_status_id: number, 
  Health_Status: string, 
  pregnancy_status: number, 
  name: string,
  animal_father_id:number, 
  animal_mother_id:number,
  archive:number
}

type Father = {
  id: number, 
  breed_id: number, 
  breed: string, 
  gender: string, 
  birthdate: string, 
  health_status_id: number, 
  Health_Status: string, 
  pregnancy_status: number, 
  name: string
}

type Mother = {
  id: number, 
  breed_id: number, 
  breed: string, 
  gender: string, 
  birthdate: string, 
  health_status_id: number, 
  Health_Status: string, 
  pregnancy_status: number, 
  name: string
}

type AddFather = {
  id: number, 
  breed_id: number, 
  breed: string, 
  gender: string, 
  birthdate: string, 
  health_status_id: number, 
  Health_Status: string, 
  pregnancy_status: number, 
  name: string
}

type AddMother = {
  id: number, 
  breed_id: number, 
  breed: string, 
  gender: string, 
  birthdate: string, 
  health_status_id: number, 
  Health_Status: string, 
  pregnancy_status: number, 
  name: string
}

type AnimalType = {
  id: number,
  type: string, 
  gestation_period: number
}

type Breed = {
  id: number, 
  breed: string, 
  Animal_Type_id: number
}

type Health_Status = {
  id: number, 
  status: string
}

type AnimalKind = {
  id: number, 
  type: string
}

type animalID = {
  animal_id: number;
}

type Pregnancy = {
  PregId: number, 
  estrus_details_id:number, 
  dateConfirmed: string, 
  ExpDueDate: string, 
  ActualDueDate: string, 
  status: string,
  dateFailed: string;
  archive: number;
  name: string,
  PregStat: string,
  ED_id:number;
  EH_id: number;
  Breeder_Date: string;
  animal_id_male:number
}

type AllAnimals = {
  id: number, 
  animal_id: number,
  name:string,
  breed: string
}

type Feeds = {
  id: number, 
  feeds: string
}

type Supplement ={
  id: number,
  Vaccine_Supplement: string
}

type FAD_Feeds ={
  id: number,
  Feed_Animal_Header: number, 
  feeds_id: number,
  feeds: string,
  feeds_remarks: string, 
  status: number
}

type FAD_Supplement ={
  id: number,
  Feed_Animal_Header: number, 
  Vaccine_Supplement_id: number,
  Vaccine_Supplement: string,
  Supplement_Remarks: string, 
  status: number
}



const AddAnimal: React.FC = () =>{
  const [isOpen, setIsOpen] = useState(false);

  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [health, setHealth] = useState(1);
  const [pregnancy, setPregnancy] = useState(0)
  const [animalType, setAnimalType] = useState(0)
  const { performSQLAction, initialized } = useSQLiteDB();
  const [animalData, setAnimalData] = useState<Array<Animal>>();
  const [animalTypeData, setAnimalTypeData] = useState<Array<AnimalType>>();
  const [breedData, setBreedData] = useState<Array<Breed>>();
  const [breed, setBreed] = useState(0);
  const [healthDatah, setHealthDatah] = useState<Array<Health_Status>>();
  const [presentAlert] = useIonAlert();
  const [animalDataBreed, setAnimalDataBreed] = useState<Array<AnimalKind>>();
  const [animal_id, setAnimal_id] =useState(0);
  const barcodeRef = useRef();
  const [ExpDue, setExpDue] = useState("");
  const [PregnancyData, setPregnancyData] = useState<Array<Pregnancy>>();
  const [breed_id, setBreed_id] = useState(0);
  const [motherName, setMotherName] = useState("");
  const [father_id, setFatherId] = useState(0);
  const [pregnancy_id, setPregnancy_id] = useState(0);
  const [Offspring, setOffSpring] = useState(0);
  const [Alive, setAlive] = useState(0);
  const [male, setMale] = useState(0);
  const [female, setFemale] = useState(0);
  const [FAH_ids, setFAH_ids] = useState(0);
  const [AnimalData, setAnimalDatas] = useState<Array<AllAnimals>>()
  const [FeedsData, setFeeds] = useState<Array<Feeds>>()
  const [SupplementData, setSupplementData] = useState<Array<Supplement>>();
  const [FAD_FeedsData, setFAD_FeedsData] = useState<Array<FAD_Feeds>>();
  const [FAD_SupplementData, setFAD_SupplementData] = useState<Array<FAD_Supplement>>();
  const [feeds, setFeed] = useState(0);
  const [feedsR, setFeedsR] = useState("")
  const [supplment, setSupplement] = useState(0);
  const [supplmentR, setSupplementR] = useState("");
  const [fatherData, setfatherData] = useState<Array<Father>>();
  const [motherData, setMotherData] = useState<Array<Mother>>();
  const [selectedMother, setSelectedMother] = useState(0);
  const [selectedFather, setSelectedFather] = useState(0);
  const [AddMotherData, setAddMotherData] = useState<Array<AddMother>>();
  const [addFatherData, setAddFatherData] = useState<Array<AddFather>>();
  const {id} = useParams();

  const AnimalTypeID = id;

  useEffect(()=>{
    loadAnimal(AnimalTypeID);
    loadHealth();
    loadAnimalType();
    loadSup();
   loadFathers();
   loadMother();
    loadFeeds()
  }, [initialized])

  useEffect(()=>{
    if(gender !== "Female"){
      setPregnancy(0);
    }
  }, [gender])

    const NewAnimal = () => {
    
      loadAnimal(AnimalTypeID);
      loadAnimalType();
      setName("");
      setBirthdate("");
      setAnimalType(0);
      setGender("");
      setHealth(0)
    
  }
  const loadAnimal = (AnimalTypeID:number) => {
    try{
      performSQLAction(async(db:SQLiteDBConnection | undefined) => {
        const data = await db?.query(`SELECT Animal.id, 
          Animal.breed_id, Breed.breed, 
          Animal.gender, Animal.birthdate, 
          Animal.health_status_id, 
          Health_Status.status, 
          pregnancy_status, Animal.name, Animal.animal_father_id, Animal.animal_mother_id, Animal.archive
          FROM Animal 
          INNER JOIN Breed ON Breed.id = Animal.breed_id 
          INNER JOIN Health_Status ON Health_Status.id = Animal.health_status_id
          WHERE Breed.Animal_Type_id = ? AND Animal.archive = 0`, [AnimalTypeID]);
          setAnimalData(data?.values);
          console.log('ANIMAL', data?.values)
      })
    }catch(error){
      console.log((error as Error).message);
    }
  }
  
  const loadFathers = () =>{
    try{
      performSQLAction(async(db:SQLiteDBConnection | undefined) => {
        const data = await db?.query(`SELECT Animal.id, 
          Animal.breed_id, Breed.breed, 
          Animal.gender, Animal.birthdate, 
          Animal.health_status_id, 
          Health_Status.status, 
          pregnancy_status, Animal.name, Animal.animal_father_id, Animal.animal_mother_id
          FROM Animal 
          INNER JOIN Breed ON Breed.id = Animal.breed_id 
          INNER JOIN Health_Status ON Health_Status.id = Animal.health_status_id WHERE Animal.gender = 'Male'`);
          setfatherData(data?.values);
          console.log('FatherLoaded', data?.values)
      })
    }catch(error){
      console.log((error as Error).message);
    }
  }

  const loadMother = () =>{
    try{
      performSQLAction(async(db:SQLiteDBConnection | undefined) => {
        const data = await db?.query(`SELECT Animal.id, 
          Animal.breed_id, Breed.breed, 
          Animal.gender, Animal.birthdate, 
          Animal.health_status_id, 
          Health_Status.status, 
          pregnancy_status, Animal.name, Animal.animal_father_id, Animal.animal_mother_id
          FROM Animal 
          INNER JOIN Breed ON Breed.id = Animal.breed_id 
          INNER JOIN Health_Status ON Health_Status.id = Animal.health_status_id WHERE Animal.gender = 'Female'`);
          setMotherData(data?.values);
          console.log(data?.values)
      })
    }catch(error){
      console.log((error as Error).message);
    }
  }

  const loadAnimalType = async () => {
    try{
      performSQLAction(async(db:SQLiteDBConnection | undefined)=> {
        const data = await db?.query(`SELECT * FROM Animal_Type WHERE id = ?`, [AnimalTypeID]);
        setAnimalTypeData(data?.values);
        console.log(data);
      })
    }catch(error){
      console.log((error as Error).message);
    }
  }

  const loadHealth = () => {
    try{
      performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
        const datah = await db?.query(`SELECT * FROM Health_Status`);
        
        if(datah && datah.values){
          console.log(datah)
          setHealthDatah(datah?.values);
        }
      })
    }catch(error){
      console.log(error);
      setHealthDatah([]);
    }
  }

  const selectedAnimalType = (e:number)=>{
    setAnimalType(e);
    try{
      performSQLAction(async(db:SQLiteDBConnection | undefined)=> {
        const data = await db?.query(`SELECT * FROM Breed WHERE Animal_Type_id = ?`, [e]);
        setBreedData(data?.values)
          
        const Mothers = await db?.query(`SELECT Animal.id, 
          Animal.breed_id, Breed.breed, 
          Animal.gender, Animal.birthdate, 
          Animal.health_status_id, 
          Health_Status.status, 
          pregnancy_status, Animal.name, Animal.animal_father_id, Animal.animal_mother_id
          FROM Animal 
          INNER JOIN Breed ON Breed.id = Animal.breed_id 
          INNER JOIN Health_Status ON Health_Status.id = Animal.health_status_id WHERE Animal.gender = 'Female'
          AND Breed.Animal_Type_id = ?`, [e]);
          setAddMotherData(Mothers?.values);
          console.log('MOTHERS', Mothers?.values)

          const Fathers = await db?.query(`SELECT Animal.id, 
            Animal.breed_id, Breed.breed, 
            Animal.gender, Animal.birthdate, 
            Animal.health_status_id, 
            Health_Status.status, 
            pregnancy_status, Animal.name, Animal.animal_father_id, Animal.animal_mother_id
            FROM Animal 
            INNER JOIN Breed ON Breed.id = Animal.breed_id 
            INNER JOIN Health_Status ON Health_Status.id = Animal.health_status_id WHERE Animal.gender = 'Male'
            AND Breed.Animal_Type_id = ?`, [e]);
            setAddFatherData(Fathers?.values);
            console.log('Fathers', Fathers?.values)
      })

      


    }catch(error){
      console.log((error as Error).message);
      setBreedData([]);
    }

    
  }

  

  const getAnimalWithBreed = (e:number) => {
    console.log("WORKING")
    setBreed(e);
    console.log(e)
    console.log(breed)
    try{
      performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
        const Breeds = await db?.query(`SELECT * FROM Breed`);
        setBreedData(Breeds?.values)

        const theAnimal = await db?.query(`SELECT Animal_Type.id FROM Breed INNER JOIN Animal_Type ON Animal_Type.id = Breed.Animal_Type_id WHERE Breed.id = ?`, [e]);
        
        if (theAnimal?.values && theAnimal.values.length > 0) {
          
          const animalTypeId = theAnimal.values[0].id;
          setAnimalType(animalTypeId);
        } else {
          
          setAnimalType(0); 
        }

        const data = await db?.query(`SELECT Animal_Type.id, Animal_Type.type FROM Animal_Type`)
        setAnimalDataBreed(data?.values);
        console.log(data)
      })
    }catch(error){
      console.log((error as Error).message);
    }
  }

  const getFAHID = (animal_id:number) => {
    try{
      performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
        const id = await db?.query(`SELECT id FROM Feed_Animal_Header WHERE animal_id = ?`, [animal_id]);
        //setFAH_ids(id?.values[0].id)
       
        loadsALlData(id?.values[0].id);
        
       
      })
    }catch(error){
      console.log((error as Error).message);
    }
  }

  const editData = (data: Animal | undefined) => {
    
    if(data){
      setName(data.name);
      setBreed(data.breed_id);
      setBirthdate(data.birthdate);
      setGender(data.gender);
      setHealth(data.health_status_id);
      setPregnancy(data.pregnancy_status);
      setBreed_id(data.breed_id);
      setAnimal_id(data.id);
      loadPregnancy(animal_id);
      loadCount(animal_id);
      getAnimalWithBreed(data.breed_id);
      setMotherName(data.name);
      getFAHID(data.id)
      setSelectedFather(data.animal_father_id);
      setSelectedMother(data.animal_mother_id)
     
      //setFatherId();
    }

  }

  const loadsALlData = (FeedHead:number)=>{
    setFAH_ids(FeedHead)
    loadFAD_F(FeedHead)
    loadFAD_S(FeedHead)
    loadData(FeedHead);
  }

  const clearData = () => {
    setName("");
    setAnimalType(0);
    setBreed(0);
    setBirthdate("");
    setSelectedFather(0);
    setSelectedMother(0);
    setGender("");
    setHealth(0);
  }

  const addNewAnimal = (breed_id:number, gender: string, bday: string, health_stat: number, pregnancy_stat:number, name: string, mother_id:number, father_id:number) => {
    //INSERT IGNORE INTO Animal (breed_id, gender, birthdate, health_status_id, pregnancy_status, name) VALUES (1, "Male", "12/31/2001", 1, 0, "Cute_Neil")
    console.log(`BDAYY --${bday}`)
    console.log('FATHER', father_id);
    console.log('Mother', mother_id);
    try{
      performSQLAction(async(db:SQLiteDBConnection | undefined)=> {
        const add = await db?.query(`INSERT INTO Animal (breed_id, gender, birthdate, health_status_id, pregnancy_status, name,animal_father_id, animal_mother_id, archive ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`,[
          breed_id, gender, bday, health_stat, pregnancy_stat, name, father_id, mother_id
        ])

        if(add){
          if(health_stat == 2){

          // Fetch the maximum id from the Animal table
          const getTheAnimalIdResult = await db?.query(`SELECT MAX(id) as maxId FROM Animal`);

        // Extract the max id value safely
          const animalId = getTheAnimalIdResult?.values[0]?.maxId;
        // Insert into Disease_Animal_Header using the retrieved animal id
        const insertToSick = await db?.query(`
          INSERT INTO Disease_Animal_Header (animal_id, dateCreated, status, dateCured, vet_id)
          VALUES (?, DATE('now'), ?, ?, ?)
        `, [
                animalId, 0, "", 1
              ]);

              if(insertToSick){
                console.log('success');
              }else{

              }

          }
          presentAlert({
            header: "Success",
            buttons: ['OK']
          });
          clearData();
          const data = await db?.query(`SELECT Animal.id, 
            Animal.breed_id, Breed.breed, 
            Animal.gender, Animal.birthdate, 
            Animal.health_status_id, 
            Health_Status.status, 
            pregnancy_status, Animal.name, Animal.animal_father_id, Animal.animal_mother_id, Animal.archive
            FROM Animal 
            INNER JOIN Breed ON Breed.id = Animal.breed_id 
            INNER JOIN Health_Status ON Health_Status.id = Animal.health_status_id
            WHERE Breed.Animal_Type_id = ? AND Animal.archive = 0`, [AnimalTypeID]);
            setAnimalData(data?.values);
            console.log(data)
            const today = new Date().toISOString().split('T')[0];
           

            const animalId = await db?.query(`SELECT MAX(id) as id FROM Animal`);
            const insertedId = animalId?.values[0]?.id;

          const FeedsAnimal = await db?.query(
            `INSERT INTO Feed_Animal_Header (animal_id, dateCreated) VALUES (?, ?)`,
            [insertedId, today]
          );

          if(FeedsAnimal){
            console.log(insertedId)
            
          }
          await db?.execute('COMMIT')
        }else{
          presentAlert({
            header: "Error",
            buttons: ['OK']
          });
        }
      })
    }catch(error){
      console.log((error as Error).message);
    }
  }

  const updateAnimal = (breed_id:number, gender: string, bday: string, name: string, id: number) => {
   
    try{
      performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
        const updateData = await db?.query(
          `UPDATE Animal 
           SET breed_id = ?, birthdate = ?, gender = ?, name = ? 
           WHERE id = ?`, 
          [breed_id, bday, gender, name, id]
        );
        
        if(updateData){
          presentAlert({
            header: "Success", 
            buttons: ['OK']
          });
          
          const data = await db?.query(`SELECT Animal.id, 
            Animal.breed_id, Breed.breed, 
            Animal.gender, Animal.birthdate, 
            Animal.health_status_id, 
            Health_Status.status, 
            pregnancy_status, Animal.name, Animal.animal_father_id, Animal.animal_mother_id, Animal.archive
            FROM Animal 
            INNER JOIN Breed ON Breed.id = Animal.breed_id 
            INNER JOIN Health_Status ON Health_Status.id = Animal.health_status_id
            WHERE Breed.Animal_Type_id = ? AND Animal.archive = 0`, [AnimalTypeID]);
            setAnimalData(data?.values);
            await db?.execute('COMMIT')

        }else{
          presentAlert({
            header: "Success", 
            buttons: ['OK']
          })

          
        }
      })
    }catch(error){  
      console.log((error as Error).message);
    }
  }

  const deleteAnimal = (animal_id:number) =>{
    try{
      performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
        const updateData = await db?.query(
          `UPDATE Animal 
           SET archive = 1
           WHERE id = ?`, 
          [animal_id]
        );
        
        if(updateData){
          presentAlert({
            header: "Success", 
            buttons: ['OK']
          });
          
          const data = await db?.query(`SELECT Animal.id, 
            Animal.breed_id, Breed.breed, 
            Animal.gender, Animal.birthdate, 
            Animal.health_status_id, 
            Health_Status.status, 
            pregnancy_status, Animal.name, Animal.animal_father_id, Animal.animal_mother_id, Animal.archive
            FROM Animal 
            INNER JOIN Breed ON Breed.id = Animal.breed_id 
            INNER JOIN Health_Status ON Health_Status.id = Animal.health_status_id
            WHERE Breed.Animal_Type_id = ? AND Animal.archive = 0`, [AnimalTypeID]);
            setAnimalData(data?.values);
            await db?.execute('COMMIT')

        }else{
          presentAlert({
            header: "Success", 
            buttons: ['OK']
          })

          
        }
      })
    }catch(error){  
      console.log((error as Error).message);
    }
  }

  const downloadBarcode = async () => {
    const canvas = await html2canvas(barcodeRef.current);
    const dataUrl = canvas.toDataURL('image/png');

    // Convert the base64 string to a blob
    const blob = await (await fetch(dataUrl)).blob();
    const reader = new FileReader();

    reader.onloadend = async () => {
        const base64data = reader.result;

        // Save the file using Capacitor's Filesystem
        await Filesystem.writeFile({
            path: 'barcodes/' + name + '.png', // Specify the path and file name
            data: base64data, 
            directory: Directory.Documents, // Choose an appropriate directory
            recursive: true // Create the directory if it doesn't exist
        });

        alert('Barcode saved successfully!');
    };

    reader.readAsDataURL(blob);
};

  const refreshThePage = (event: CustomEvent<RefresherEventDetail>) => {
    setTimeout(() => {
      loadAnimalType(); // Call your data-loading function
      loadAnimal(id);
  
      // Signal that the refresh has completed
      event.detail.complete();
    }, 2000);
  };



const loadCount = async (animal_id:number) =>{
    
    try{
            await performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
                const data = await db?.query(`
                  SELECT COUNT(*) AS C FROM Pregnancy AS P
                  INNER JOIN Estrus_Details AS ED ON ED.id = P.estrus_details_id
                  INNER JOIN Estrus_Head AS EH ON EH.id = ED.Estrus_Head
                  INNER JOIN Animal AS A ON A.id = ED.animal_id_male
                  WHERE EH.animal_id = ?
                `, [animal_id]);
               
             
                
            })
        
     }catch(error){
         console.log((error as Error).message);
        
     }
}

const loadPregnancy = (animal_id:number) =>{
    try{
            performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
                const data = await db?.query(`
                  SELECT P.id as PregId, P.status as PregStat, ED.id as ED_id, EH.id AS EH_id, ED.Breeder_Date, * FROM Pregnancy AS P
                  INNER JOIN Estrus_Details AS ED ON ED.id = P.estrus_details_id
                  INNER JOIN Estrus_Head AS EH ON EH.id = ED.Estrus_Head
                  INNER JOIN Animal AS A ON A.id = ED.animal_id_male
                  WHERE EH.animal_id = ?
                `, [animal_id]);
                setPregnancyData(data?.values);
                console.log(data)
                
            })
       
     }catch(error){
         console.log((error as Error).message);
        
     }
}

const UpdateExpDue = (dueDate: string, pregId: number) =>{
    try{
        performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
            const data = await db?.query(`
              UPDATE Pregnancy SET ExpDueDate = ? WHERE id = ?
            `, [dueDate, pregId]);
            if(data){
                presentAlert({
                    header: "Success",
                    buttons: ['OK']
                });
                const data = await db?.query(`
                    SELECT P.id as PregId, P.status as PregStat, ED.id as ED_id, EH.id AS EH_id, ED.Breeder_Date, * FROM Pregnancy AS P
                    INNER JOIN Estrus_Details AS ED ON ED.id = P.estrus_details_id
                    INNER JOIN Estrus_Head AS EH ON EH.id = ED.Estrus_Head
                    INNER JOIN Animal AS A ON A.id = ED.animal_id_male
                    WHERE EH.animal_id = ?
                  `, [animal_id]);
                  setPregnancyData(data?.values);
            }else{
                presentAlert({
                    header: "Error",
                    buttons: ['OK']
                })
            }
            
        })
     }catch(error){
         console.log((error as Error).message);
        
     }
}

const FailedPreg = (pregId: number, ED_id: number, EH_id:number) =>{
    console.log('Clicked')
    try{
        performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
            const data = await db?.query(`
              UPDATE Pregnancy SET status = 'Failed' WHERE id = ?
            `, [ pregId]);
            if(data){
                presentAlert({
                    header: "Success",
                    buttons: ['OK']
                });
                const data2 = await db?.query(`
                    UPDATE Estrus_Details SET status = 'Pregnant but failed'
                    WHERE id = ?
                 `, [ED_id]);

                 const data3 = await db?.query(`
                    UPDATE Estrus_Head SET status = 'Failed'
                    WHERE id = ?
                 `, [EH_id]);

                 const data4 = await db?.query(`
                  UPDATE Animal SET pregnancy_status = 0
                  WHERE id = ?
                `, [animal_id])

                 const data = await db?.query(`
                    SELECT P.id as PregId, P.status as PregStat, ED.id as ED_id, EH.id AS EH_id, ED.Breeder_Date, * FROM Pregnancy AS P
                    INNER JOIN Estrus_Details AS ED ON ED.id = P.estrus_details_id
                    INNER JOIN Estrus_Head AS EH ON EH.id = ED.Estrus_Head
                    INNER JOIN Animal AS A ON A.id = ED.animal_id_male
                    WHERE EH.animal_id = ?
                  `, [animal_id]);
                  setPregnancyData(data?.values);
            }else{
                presentAlert({
                    header: "Error",
                    buttons: ['OK']
                })
            }
            
        })
     }catch(error){
         console.log((error as Error).message);
        
     }
}

const SuccessPreg = (pregId: number, ED_id: number, EH_id:number, animal_id_male:number) =>{
  console.log('Clicked')
  try{
      performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
          const data = await db?.query(`
            UPDATE Pregnancy SET status = 'Success' WHERE id = ?
          `, [ pregId]);
          if(data){
              presentAlert({
                  header: "Success",
                  buttons: ['OK']
              });

              setIsOpen(true);
              setPregnancy_id(pregId);
              setFatherId(animal_id_male);

              const data2 = await db?.query(`
                  UPDATE Estrus_Details SET status = 'Success'
                  WHERE id = ?
               `, [ED_id]);

               const data3 = await db?.query(`
                  UPDATE Estrus_Head SET status = 'Given Birth'
                  WHERE id = ?
               `, [EH_id]);

               const data4 = await db?.query(`
                  UPDATE Animal SET pregnancy_status = 0
                  WHERE id = ?
                `, [animal_id])

               const data = await db?.query(`
                  SELECT P.id as PregId, P.status as PregStat, ED.id as ED_id, EH.id AS EH_id, ED.Breeder_Date, * FROM Pregnancy AS P
                  INNER JOIN Estrus_Details AS ED ON ED.id = P.estrus_details_id
                  INNER JOIN Estrus_Head AS EH ON EH.id = ED.Estrus_Head
                  INNER JOIN Animal AS A ON A.id = ED.animal_id_male
                  WHERE EH.animal_id = ?
                `, [animal_id]);
                setPregnancyData(data?.values);
          }else{
              presentAlert({
                  header: "Error",
                  buttons: ['OK']
              })
          }
          
      })
   }catch(error){
       console.log((error as Error).message);
      
   }
}

const givenBirth = (pregId:number, offSpringNum:number, AliveNum:number, Male: number, Female:number, breed_id:number, MotherName:string, MotherId:number, father_id:number) =>{
  try{

    const TotalDead = offSpringNum - AliveNum;

    let Header_id;
    let childAnimal_id;

    performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
        const data2 = await db?.query(`
            INSERT INTO Birth_Pregnanc_Head (pregnancy_id, actualDate, OffspringNum, 
             DeadNum, AliveNum, SexMnum, SexFNum 
            ) VALUES (?, date('now'), ?, ?, ?,?,?)
          `, [pregId, offSpringNum, TotalDead, AliveNum, Male, Female]);
        if(data2){
          
            setIsOpen(false);

            presentAlert({
              header: "Added Livestock Successfully!",
              buttons: ['OK']
          })

          const getHeader_id = await db?.query(`
                SELECT MAX(id) AS id FROM Birth_Pregnanc_Head         
            `);

            Header_id = getHeader_id?.values[0].id;
            
        }else{
            presentAlert({
                header: "There is an error in saving Pregnancy",
                buttons: ['OK']
            })
        }

        for (let i = 0; i < Male; i++) {
          const InsertAnimal = await db?.query(`
              INSERT INTO Animal (breed_id, gender, birthdate, health_status_id, pregnancy_status, name, animal_father_id, animal_mother_id, archive)
              VALUES (?, "Male", date('now'), 1, 0, ?, ?, ?, 0)
          `, [breed_id, MotherName + 'Child' + i, father_id, MotherId]);

          console.log("Inserted Male")

          const animal_id = await db?.query(`
            SELECT MAX(id) AS id FROM Animal         
        `);
        

        childAnimal_id = animal_id?.values[0].id;

        const FeedsAnimal = await db?.query(
          `INSERT INTO Feed_Animal_Header (animal_id, dateCreated) VALUES (?, date('now'))`,
          [childAnimal_id]
        );

        console.log(`Animal: ${childAnimal_id}`);

        const insertToDetails = await db?.query(`
            INSERT INTO Birth_Pregnanc_Details (Birth_Pregnancy_Head, animal_id, sex, Health_Status_id)
            VALUES (?, ?, 'Male', 1)
          `, [Header_id, childAnimal_id]);
      }

        console.log(`Female ${Female}`);
        for (let i = 0; i < Female; i++) {
          const InsertAnimal = await db?.query(`
            INSERT INTO Animal (breed_id, gender, birthdate, health_status_id, pregnancy_status, name, animal_father_id, animal_mother_id, archive)
            VALUES (?, "Female", date('now'), 1, 0, ?, ?, ?, 0)
        `, [breed_id, MotherName + 'Child' + i, father_id, MotherId]);
          const animal_id = await db?.query(`
            SELECT MAX(id) AS id FROM Animal         
        `);

        console.log("Inserted Female")

        childAnimal_id = animal_id?.values[0].id;

        const FeedsAnimal = await db?.query(
          `INSERT INTO Feed_Animal_Header (animal_id, dateCreated) VALUES (?, date('now'))`,
          [childAnimal_id]
        );

        console.log(`Animal: ${childAnimal_id}`);

        const insertToDetails = await db?.query(`
            INSERT INTO Birth_Pregnanc_Details (Birth_Pregnancy_Head, animal_id, sex, Health_Status_id)
            VALUES (?, ?, 'Male', 1)
          `, [Header_id, childAnimal_id]);
          
      }

      const data = await db?.query(`SELECT Animal.id, 
        Animal.breed_id, Breed.breed, 
        Animal.gender, Animal.birthdate, 
        Animal.health_status_id, 
        Health_Status.status, 
        pregnancy_status, Animal.name, Animal.animal_father_id, Animal.animal_mother_id, Animal.archive
        FROM Animal 
        INNER JOIN Breed ON Breed.id = Animal.breed_id 
        INNER JOIN Health_Status ON Health_Status.id = Animal.health_status_id
        WHERE Breed.Animal_Type_id = ? AND Animal.archive = 0`, [AnimalTypeID]);
        setAnimalData(data?.values);
        console.log(data);
    
        
    })
 }catch(error){
     console.log((error as Error).message);
 }
}

const editDataPreg = (data: Pregnancy | undefined) =>{
    if(data){
        setExpDue(data.ExpDueDate);
    }
}
const loadData = (FAH_ids:number) =>{
  
  try{
      performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
          const data = await db?.query(`
                  SELECT FAH.id, A.id, A.name, B.breed FROM Feed_Animal_Header AS FAH 
                  INNER JOIN Animal AS A ON A.id = FAH.animal_id
                  INNER JOIN Breed AS B ON B.id = breed_id
                  WHERE FAH.id = ?
              `, [FAH_ids]);
          setAnimalDatas(data?.values);
          console.log(FAH_ids)
       
      })
  }catch(error){
      console.log((error as Error).message)
  }
}

const loadFeeds = () =>{
  try{
      performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
          const data = await db?.query(`
                 SELECT * FROM Feeds
              `);
              setFeeds(data?.values);
      })
  }catch(error){
      console.log((error as Error).message)
  }
}

const loadSup = () =>{
  try{
      performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
          const data = await db?.query(`
                 SELECT * FROM Vaccine_Supplement WHERE remedy_id = 2
              `);
              setSupplementData(data?.values);
              console.log(data)
      })
  }catch(error){
      console.log((error as Error).message)
  }
}

const InsertNewFeeds = (FAH_ids:number, feeds_id:number, feeds_remarks:string) =>{
  if(feeds_id == 0 || feeds_remarks == "" || feeds_remarks == null){
      presentAlert({
          header: "Empty",
          buttons: ['OK']
      })
  }else{
      try{
          performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
              const data = await db?.query(`
                     INSERT INTO Feed_Animal_Details_Feeds (Feed_Animal_Header, feeds_id, feeds_remarks, status, dateCreated)
                     VALUES (?, ?, ?, 0, DATE('now'))
                  `, [FAH_ids, feeds_id, feeds_remarks]);
             if(data){
                  presentAlert({
                      header: "Success",
                      buttons: ['OK']
                  });
                  const data = await db?.query(`
                      SELECT F.id, F.Feed_Animal_Header, F.feeds_id, FE.feeds, F.feeds_remarks, F.status FROM Feed_Animal_Details_Feeds AS F 
                      INNER JOIN Feeds AS FE ON FE.id = F.feeds_id
                      WHERE F.Feed_Animal_Header = ? AND status = 0
                  `, [FAH_ids])
              setFAD_FeedsData(data?.values);
              setFeed(0);
              setFeedsR("")
              await db?.execute('COMMIT');
              
             }
          })
      }catch(error){
          console.log((error as Error).message)
      }
  }
  
}

const InsertNewSupplement = (FAH_ids:number, feeds_id:number, feeds_remarks:string) =>{
  if(feeds_id == 0 || feeds_remarks == "" || feeds_remarks == null){
      presentAlert({
          header: "Empty",
          buttons: ['OK']
      })
  }else{
      try{
          performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
              const data = await db?.query(`
                     INSERT INTO Feed_Animal_Details_Supplement (Feed_Animal_Header, Vaccine_Supplement_id, Supplement_Remarks, status, dateCreated)
                     VALUES (?, ?, ?, 0, DATE('now'))
                  `, [FAH_ids, feeds_id, feeds_remarks]);
             if(data){
                  presentAlert({
                      header: "Success",
                      buttons: ['OK']
                  });
                  const data = await db?.query(`
                      SELECT F.id, F.Feed_Animal_Header, F.Vaccine_Supplement_id, FE.Vaccine_Supplement, F.Supplement_Remarks, F.status FROM Feed_Animal_Details_Supplement AS F 
                      INNER JOIN Vaccine_Supplement AS FE ON FE.id = F.Vaccine_Supplement_id
                      WHERE F.Feed_Animal_Header = ? AND status = 0
                  `, [FAH_ids])
              setFAD_SupplementData(data?.values);
              setSupplement(0);
              setSupplementR("")
              await db?.execute('COMMIT');
              
             }
          })
      }catch(error){
          console.log((error as Error).message)
      }
  }
  
}

const UpdateFeeds = (feeds_id:number, remarks:string, id:number, FAH_ids:number) =>{
  try{
      performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
          const data = await db?.query(`
                 UPDATE Feed_Animal_Details_Feeds SET feeds_id = ?, feeds_remarks = ? WHERE id = ?
              `, [feeds_id, remarks, id]);
         if(data){
              presentAlert({
                  header: "Success",
                  buttons: ['OK']
              });
              const data = await db?.query(`
                  SELECT F.id, F.Feed_Animal_Header, F.feeds_id, FE.feeds, F.feeds_remarks, F.status FROM Feed_Animal_Details_Feeds AS F 
                  INNER JOIN Feeds AS FE ON FE.id = F.feeds_id
                  WHERE F.Feed_Animal_Header = ? AND status = 0
              `, [FAH_ids])
          setFAD_FeedsData(data?.values);
          await db?.execute('COMMIT');
          
         }
      })
  }catch(error){
      console.log((error as Error).message)
  }
}

const UpdateSupp = (sup:number, remarks:string, id:number, FAH_ids:number) =>{
  try{
      performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
          const data = await db?.query(`
                 UPDATE Feed_Animal_Details_Supplement SET Vaccine_Supplement_id = ?, Supplement_Remarks = ? WHERE id = ?
              `, [sup, remarks, id]);
         if(data){
              presentAlert({
                  header: "Success",
                  buttons: ['OK']
              });
              const datas = await db?.query(`
                  SELECT F.id, F.Feed_Animal_Header, F.Vaccine_Supplement_id, FE.Vaccine_Supplement, F.Supplement_Remarks, F.status FROM Feed_Animal_Details_Supplement AS F 
                  INNER JOIN Vaccine_Supplement AS FE ON FE.id = F.Vaccine_Supplement_id
                  WHERE F.Feed_Animal_Header = ? AND status = 0
              `, [FAH_ids])
          setFAD_SupplementData(datas?.values);
          setSupplement(0);
          setSupplementR("")
          await db?.execute('COMMIT');
          
         }
      })
  }catch(error){
      console.log((error as Error).message)
  }
}

const DoneFeeds = (id:number, FAH_ids:number) =>{
  try{
      performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
          const data = await db?.query(`
                 UPDATE Feed_Animal_Details_Feeds SET status = ? WHERE id = ?
              `, [1, id]);
         if(data){
              presentAlert({
                  header: "Success",
                  buttons: ['OK']
              });
              const data = await db?.query(`
                  SELECT F.id, F.Feed_Animal_Header, F.feeds_id, FE.feeds, F.feeds_remarks, F.status FROM Feed_Animal_Details_Feeds AS F 
                  INNER JOIN Feeds AS FE ON FE.id = F.feeds_id
                  WHERE F.Feed_Animal_Header = ? AND status = 0
              `, [FAH_ids])
          setFAD_FeedsData(data?.values);
          await db?.execute('COMMIT');
          
         }
      })
  }catch(error){
      console.log((error as Error).message)
  }
}

const DoneSupplement = (id:number, FAH_ids:number) =>{
  try{
      performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
          const data = await db?.query(`
                 UPDATE Feed_Animal_Details_Supplement SET status = ? WHERE id = ?
              `, [1, id]);
         if(data){
              presentAlert({
                  header: "Success",
                  buttons: ['OK']
              });
              const datas = await db?.query(`
                  SELECT F.id, F.Feed_Animal_Header, F.Vaccine_Supplement_id, FE.Vaccine_Supplement, F.Supplement_Remarks, F.status FROM Feed_Animal_Details_Supplement AS F 
                  INNER JOIN Vaccine_Supplement AS FE ON FE.id = F.Vaccine_Supplement_id
                  WHERE F.Feed_Animal_Header = ? AND status = 0
              `, [FAH_ids])
          setFAD_SupplementData(datas?.values);
          await db?.execute('COMMIT');
          
         }
      })
  }catch(error){
      console.log((error as Error).message)
  }
}

//1 = done and 2 is deleted
const ArchiveFeeds = (id:number, FAH_ids:number) =>{
  try{
      performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
          const data = await db?.query(`
                 UPDATE Feed_Animal_Details_Feeds SET status = ? WHERE id = ?
              `, [2, id]);
         if(data){
              presentAlert({
                  header: "Success",
                  buttons: ['OK']
              });
              const data = await db?.query(`
                  SELECT F.id, F.Feed_Animal_Header, F.feeds_id, FE.feeds, F.feeds_remarks, F.status FROM Feed_Animal_Details_Feeds AS F 
                  INNER JOIN Feeds AS FE ON FE.id = F.feeds_id
                  WHERE F.Feed_Animal_Header = ? AND status = 0
              `, [FAH_ids])
          setFAD_FeedsData(data?.values);
          await db?.execute('COMMIT');
          
         }
      })
  }catch(error){
      console.log((error as Error).message)
  }
}

const ArchiveSupp = (id:number, FAH_ids:number) =>{
  try{
      performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
          const data = await db?.query(`
                 UPDATE Feed_Animal_Details_Supplement SET status = ? WHERE id = ?
              `, [2, id]);
         if(data){
              presentAlert({
                  header: "Success",
                  buttons: ['OK']
              });
              const datas = await db?.query(`
                  SELECT F.id, F.Feed_Animal_Header, F.Vaccine_Supplement_id, FE.Vaccine_Supplement, F.Supplement_Remarks, F.status FROM Feed_Animal_Details_Supplement AS F 
                  INNER JOIN Vaccine_Supplement AS FE ON FE.id = F.Vaccine_Supplement_id
                  WHERE F.Feed_Animal_Header = ? AND status = 0
              `, [FAH_ids])
          setFAD_SupplementData(datas?.values);
          await db?.execute('COMMIT');
          
         }
      })
  }catch(error){
      console.log((error as Error).message)
  }
}


const editDatas = (data: AllAnimals | undefined) =>{
  if(data){
      
      loadFAD_F(data.id)
      loadFAD_S(data.id)
   
      loadFeeds()
      
  }
}

const loadFAD_F = (id:number) =>{

  console.log(`FAH ${id}`)
  try{
      performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
          const data = await db?.query(`
                  SELECT F.id, F.Feed_Animal_Header, F.feeds_id, FE.feeds, F.feeds_remarks, F.status FROM Feed_Animal_Details_Feeds AS F 
                  INNER JOIN Feeds AS FE ON FE.id = F.feeds_id
                  WHERE F.Feed_Animal_Header = ? AND status = 0
              `, [id])
          setFAD_FeedsData(data?.values);
          console.log(data)
      })
  }catch(error){
      console.log((error as Error).message)
  }
}

const loadFAD_S = (id:number) =>{
  try{
      performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
          const data = await db?.query(`
                  SELECT F.id, F.Feed_Animal_Header, F.Vaccine_Supplement_id, FE.Vaccine_Supplement, F.Supplement_Remarks, F.status FROM Feed_Animal_Details_Supplement AS F 
                  INNER JOIN Vaccine_Supplement AS FE ON FE.id = F.Vaccine_Supplement_id
                  WHERE F.Feed_Animal_Header = ? AND status = 0
              `, [id])
          setFAD_SupplementData(data?.values);
      })
  }catch(error){
      console.log((error as Error).message)
  }
}

const editFeeds = (data: FAD_Feeds | undefined) => {
  if(data){
      setFeed(data.feeds_id);
      setFeedsR(data.feeds_remarks)
      loadFeeds()
  }else{
      setFeed(0);
      setFeedsR("")
  }
}

const editSupplements = (data: FAD_Supplement | undefined) => {
  if(data){
      setSupplement(data.Vaccine_Supplement_id);
      setSupplementR(data.Supplement_Remarks)
      loadFeeds()
  }else{
      setFeed(0);
      setFeedsR("")
  }
}

const RefreshThePage = (event: CustomEvent<RefresherEventDetail>)=>{

  setTimeout(()=>{
      loadData(FAH_ids);
      loadFeeds();
      loadSup();
      event.detail.complete();
  }, 2000)

}

const modalPregnancy = useRef<HTMLIonModalElement>(null);

  const modal = useRef<HTMLIonModalElement>(null);
    return(
        <>
         <SideBar />
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Add Animal</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonRefresher slot="fixed" onIonRefresh={refreshThePage}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          {animalData?.map((animal)=>(
            <IonCard key={animal.id} id= {`cardanimal-${animal?.id}`} onClick={()=>editData(animal)}>
                <IonCardHeader color={animal.health_status_id === 2 ? "danger":""}>
                  <IonCardTitle>{animal.name}
                  </IonCardTitle>
                  <IonCardSubtitle>{animal.breed} {animal.pregnancy_status === 1 ? "| Pregnant" : null} {animal.health_status_id === 2 ? "| Sick":null}</IonCardSubtitle>
                </IonCardHeader>
            </IonCard>
          ))}

          {animalData?.map((modalAn)=> (
            <IonModal ref={modal} key={modalAn.id} trigger={`cardanimal-${modalAn.id}`} initialBreakpoint={1} breakpoints={[0, 1]}>
            <IonContent className="ion-padding">
              <IonTabs>
                <IonTab tab="animal">
                  <div id="animal-page" className="ion-padding">
                  <IonRow>
                    <IonCol className="ion-text-center">
                        <h2>Edit {modalAn.name}</h2>
                    </IonCol>
                </IonRow>
                <IonRow className="ion-text-center">
                <div ref={barcodeRef}>
                <Barcode value={`${modalAn.id} - ${modalAn.name}`} />
                </div>
                  
                </IonRow>
                <IonRow className="ion-margin-bottom">
                    <IonInput
                       label="Name"
                       labelPlacement="floating"
                       value={name}
                       onIonInput={(e)=>setName(e.target.value as string)}
                    ></IonInput>
                </IonRow>
                <IonRow className="ion-margin-bottom">
                  <IonCol>
                    <IonSelect label="Mother" labelPlacement="floating" value={selectedMother} disabled>
                        {motherData?.map((mother)=>(
                          <IonSelectOption key={mother.id} value={mother.id}>{mother.name}</IonSelectOption>
                        ))}
                    </IonSelect>
                  </IonCol>
                  <IonCol>
                    <IonSelect label="Father" labelPlacement="floating" value={selectedFather} disabled>
                        {fatherData?.map((father)=>(
                          <IonSelectOption key={father.id} value={father.id}>{father.name}</IonSelectOption>
                        ))}
                    </IonSelect>
                  </IonCol>
                </IonRow>
                <IonRow className="ion-margin-bottom">
                  <IonCol>
                    <IonSelect label="Animal" labelPlacement="floating" value={animalType} onIonChange={(e)=>selectedAnimalType(e.target.value as number)}>
                       {animalDataBreed?.map((ty)=>(
                          <IonSelectOption key={ty.id} value={ty.id}>{ty.type}</IonSelectOption>
                       ))}
                    </IonSelect>
                  </IonCol>
                  <IonCol>
                    <IonSelect label="Breed" labelPlacement="floating" value={breed} onIonChange={(e)=>getAnimalWithBreed(e.target.value as number)}>
                        {breedData?.map((b)=>(
                          <IonSelectOption key={b.id} value={b.id}>{b.breed}</IonSelectOption>
                        ) )}
                    </IonSelect>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonSelect label="Gender" labelPlacement="floating" value={gender} onIonChange={(e)=>setGender(e.target.value as string)}>
                       <IonSelectOption value={"Male"}>Male</IonSelectOption>
                       <IonSelectOption value={"Female"}>Female</IonSelectOption>
                    </IonSelect>
                  </IonCol>
                  <IonCol>
                    <IonInput className="ion-margin-bottom"
                    type="date"
                    label="Date of Birth"
                    labelPlacement="floating"
                    value={birthdate}
                    onIonInput={(e) => setBirthdate((e.target as unknown as HTMLInputElement).value)}
                    >
                      </IonInput>
                  </IonCol>
                 
                </IonRow>
                  <IonRow>
                    <IonSelect label="Health" disabled labelPlacement="floating" className="ion-margin-bottom" value={health} onIonChange={(e)=>setHealth(e.target.value as number)}>
                        {healthDatah?.map((h)=> (
                          <IonSelectOption key={h.id} value={h.id}>{h.status}</IonSelectOption>
                        ))}
                    </IonSelect>
                  </IonRow>
                  {gender === "Female" ?( <IonRow>
                    
                  </IonRow> ) : null}
                      
                  <IonGrid fixed={true}>
  <IonRow>
    <IonCol>
      <IonButton 
        expand="block" 
        size="large" 
        className="ion-margin-vertical" 
        onClick={() => updateAnimal(breed, gender, birthdate, name, modalAn.id)}
      >
        <IonIcon icon={saveOutline} slot="icon-only" />
      </IonButton>
    </IonCol>

    <IonCol>
      <IonButton 
        expand="block" 
        size="large" 
        className="ion-margin-vertical" 
        onClick={downloadBarcode}
      >
        <IonIcon icon={downloadOutline} slot="icon-only" />
      </IonButton>
    </IonCol>

    <IonCol>
      <IonButton 
        expand="block" 
        size="large" 
        className="ion-margin-vertical" 
        color="danger" 
        onClick={() => deleteAnimal(modalAn.id)}
      >
        <IonIcon icon={trashOutline} slot="icon-only" />
      </IonButton>
    </IonCol>
  </IonRow>
</IonGrid>
                  </div>
             
                </IonTab>
                <IonTab tab="feeds" onClick={()=>getFAHID(animal_id)}>
                    <div id="feeds-page">
                    <IonRefresher slot="fixed" onIonRefresh={RefreshThePage}>
                        <IonRefresherContent></IonRefresherContent>
                    </IonRefresher>
                               
                                    <IonRow>
                                            <IonCol className="ion-text-center">
                                                <h3>Add foods</h3>
                                            </IonCol>
                                        </IonRow>
                                        <IonCard>
                                            <IonCardHeader>
                                                <IonCardTitle>Feeds</IonCardTitle>
                                            </IonCardHeader>
                                            <IonCardContent>
                                                <IonRow>
                                                    <IonSelect label="Select Feeds" value={feeds} labelPlacement="floating" onIonChange={(e)=>setFeed(e.target.value as number)}>
                                                        <IonSelectOption value={0}>None</IonSelectOption>
                                                        {FeedsData?.map((fm)=>(
                                                            <IonSelectOption key={fm.id} value={fm.id}>{fm.feeds}</IonSelectOption>
                                                        ))}
                                                    </IonSelect>
                                                    <IonInput 
                                                        type="text"
                                                        label="Remarks"
                                                        value={feedsR}
                                                        onIonInput={(e)=>setFeedsR(e.target.value as string)}
                                                        labelPlacement="floating"
                                                        ></IonInput>
                                                </IonRow>
                                                <IonButton expand="full" className="ion-margin-top"onClick={()=>InsertNewFeeds(FAH_ids, feeds, feedsR)}> ADD </IonButton>
                                            </IonCardContent>
                                        </IonCard>
                                        <IonCard>
                                            <IonCardHeader>
                                                <IonCardTitle>Supplement</IonCardTitle>
                                            </IonCardHeader>
                                            <IonCardContent>
                                                <IonRow>
                                                    <IonSelect label="Select Supplements" value={supplment} onIonChange={(e)=>setSupplement(e.target.value as number)} labelPlacement="floating">
                                                        <IonSelectOption value={0}>None</IonSelectOption>
                                                        {SupplementData?.map((sm)=>(
                                                            <IonSelectOption key={sm.id} value={sm.id}>{sm.Vaccine_Supplement}</IonSelectOption>
                                                        ))}
                                                    </IonSelect>
                                                    <IonInput 
                                                        type="text"
                                                        label="Remarks"
                                                        labelPlacement="floating"
                                                        onIonInput={(e)=>setSupplementR(e.target.value as string)}
                                                        required
                                                        ></IonInput>
                                                </IonRow>
                                                <IonButton expand="full" className="ion-margin-top" onClick={()=>InsertNewSupplement(FAH_ids, supplment, supplmentR)}> ADD </IonButton>
                                            </IonCardContent>
                                            
                                        </IonCard>

                                        {FAD_FeedsData?.map((F)=>(
                                        <IonRow key={F.id}>
                                            <IonCol>
                                            <IonItemSliding>
                                                <IonItemOptions side="end">
                                                    <IonItemOption color="white" id={`edit${F.id}`} onClick={()=>editFeeds(F)}><IonIcon slot="icon-only" icon={createOutline}></IonIcon></IonItemOption>
                                                    <IonItemOption color="success" onClick={()=>DoneFeeds(F.id, F.Feed_Animal_Header)}><IonIcon slot="icon-only" icon={checkmark}></IonIcon></IonItemOption>
                                                    <IonItemOption color="danger" onClick={()=>ArchiveFeeds(F.id, F.Feed_Animal_Header)}><IonIcon slot="icon-only" icon={closeOutline}></IonIcon></IonItemOption>
                                                </IonItemOptions>

                                                <IonItem>
                                                <IonLabel><h1>{F.feeds}</h1><small>{F.feeds_remarks} | Feeds</small></IonLabel>
                                                </IonItem>
                                            </IonItemSliding>
                                            </IonCol>
                                        </IonRow>
                                        ))}

                                       {FAD_FeedsData?.map((FAlert)=>(
                                            <IonModal key={FAlert.id} trigger={`edit${FAlert.id}`} initialBreakpoint={0.6} breakpoints={[0, 1]}>
                                                <IonContent className="ion-padding">
                                                    <IonRow>
                                                        <IonCol className="ion-text-center">
                                                            <h1>Edit {FAlert.feeds}</h1>
                                                        </IonCol>
                                                    </IonRow>
                                                    <IonRow>
                                                       <IonSelect 
                                                       label="Feeds"
                                                       labelPlacement="floating"
                                                        value={feeds}
                                                        onIonChange={(e)=>setFeed(e.target.value as number)}
                                                        >
                                                        <IonSelectOption value={0}>None</IonSelectOption>
                                                            {FeedsData?.map((fm)=>(
                                                                <IonSelectOption key={fm.id} value={fm.id}>{fm.feeds}</IonSelectOption>
                                                            ))}
                                                       </IonSelect>
                                                    </IonRow>
                                                    <IonRow>
                                                        <IonInput
                                                            label="Remarks"
                                                            labelPlacement="floating"
                                                            value={feedsR}
                                                            onIonInput={(e)=>setFeedsR(e.target.value as string)}
                                                        >
                                                        </IonInput>
                                                    </IonRow>
                                                    <IonButton className="ion-margin-top" expand="block" onClick={()=>UpdateFeeds(feeds, feedsR, FAlert.id, FAlert.Feed_Animal_Header)}>Update</IonButton>
                                                </IonContent>
                                            </IonModal>
                                       ))}

                                        {FAD_SupplementData?.map((S)=>(
                                        <IonRow key={S.id}>
                                            <IonCol>
                                            <IonItemSliding>
                                            <IonItemOptions side="end">
                                                    <IonItemOption color="white" id={`edit${S.id}`}><IonIcon slot="icon-only" icon={createOutline} onClick={()=>editSupplements(S)}></IonIcon></IonItemOption>
                                                    <IonItemOption color="success"><IonIcon slot="icon-only" icon={checkmark} onClick={()=>{DoneSupplement(S.id, FAH_ids)}}></IonIcon></IonItemOption>
                                                    <IonItemOption color="danger" ><IonIcon slot="icon-only" icon={closeOutline} onClick={()=>{ArchiveSupp(S.id, FAH_ids)}}></IonIcon></IonItemOption>
                                                </IonItemOptions>


                                                <IonItem>
                                                <IonLabel><h1>{S.Vaccine_Supplement}</h1><small>{S.Supplement_Remarks} | Supplements</small></IonLabel>
                                                </IonItem>
                                            </IonItemSliding>
                                            </IonCol>
                                        </IonRow>
                                        ))}

                                        {FAD_SupplementData?.map((MAlert)=>(
                                            <IonModal key={MAlert.id} trigger={`edit${MAlert.id}`} initialBreakpoint={0.6} breakpoints={[0, 1]}>
                                                <IonContent className="ion-padding">
                                                    <IonRow>
                                                        <IonCol className="ion-text-center">
                                                            <h1>Edit {MAlert.Vaccine_Supplement}</h1>
                                                        </IonCol>
                                                    </IonRow>
                                                    <IonRow>
                                                       <IonSelect 
                                                       label="Supplements"
                                                       labelPlacement="floating"
                                                        value={supplment}
                                                        onIonChange={(e)=>setSupplement(e.target.value as number)}
                                                        >
                                                        <IonSelectOption value={0}>None</IonSelectOption>
                                                        {SupplementData?.map((sm)=>(
                                                            <IonSelectOption key={sm.id} value={sm.id}>{sm.Vaccine_Supplement}</IonSelectOption>
                                                        ))}
                                                       </IonSelect>
                                                    </IonRow>
                                                    <IonRow>
                                                        <IonInput
                                                            label="Remarks"
                                                            labelPlacement="floating"
                                                            value={supplmentR}
                                                            onIonInput={(e)=>setSupplementR(e.target.value as string)}
                                                        >
                                                        </IonInput>
                                                    </IonRow>
                                                    <IonButton className="ion-margin-top" expand="block" onClick={()=>UpdateSupp(supplment, supplmentR, MAlert.id, FAH_ids)}>Update</IonButton>
                                                </IonContent>
                                            </IonModal>
                                       ))}
                    </div>
                </IonTab>
                <IonTab tab="disease">
                    <div id="disease-page" className="ion-padding">
                    
                    </div>
                </IonTab>
                <IonTab tab="estrus">
                    <div id="estrus-page">
                      <IonHeader>
                        <IonToolbar><IonTitle>Estrus</IonTitle></IonToolbar>
                      </IonHeader>

                    {/* Esterus ------------------------------------------------------------------------------------------------------------*/}

                        <Estrus animal_id={animal_id} />
                    </div>
                </IonTab>
                <IonTab tab="pregnancy">
                    <div id="pregnancy-page">
                      <IonHeader>
                          <IonToolbar><IonTitle>Pregnancy</IonTitle></IonToolbar>
                      </IonHeader>

                      {/* PREGNANCY ------------------------------------------------------------------------------------------------------------*/}
                      <div className="ion-padding">
            <IonButton expand="block" onClick={()=>{loadPregnancy(animal_id)}}>Reload</IonButton>
            {PregnancyData?.map((p)=>{
                       const date = new Date(p.dateConfirmed).toLocaleDateString("en-US", {
                        month: "short", 
                        day: "numeric",  
                        year: "numeric" 
                    });
                    const date2 = new Date(p.Breeder_Date).toLocaleDateString("en-US", {
                        month: "short", 
                        day: "numeric",  
                        year: "numeric" 
                    });

                    return (
                        <IonItem key={p.PregId} id={`${p.PregId}`}>
                            <IonItemSliding>
                            <IonItemOptions side="end">
                                    <IonItemOption color="white" id={`preg-${p.PregId}`} onClick={()=>editDataPreg(p)} disabled={p.PregStat === 'Failed' || p.PregStat === 'Success' || p.PregStat === 'Given Birth'}><IonIcon slot="icon-only" icon={createOutline} ></IonIcon></IonItemOption>
                                    <IonItemOption color="success" onClick={()=>SuccessPreg(p.PregId, p.ED_id, p.EH_id, p.animal_id_male)}  disabled={p.PregStat === 'Failed' || p.PregStat === 'Success' || p.PregStat === 'Given Birth'}><IonIcon slot="icon-only" icon={checkmark} ></IonIcon></IonItemOption>
                                    <IonItemOption color="warning" onClick={() => FailedPreg(p.PregId, p.ED_id, p.EH_id)} disabled={p.PregStat === 'Failed' || p.PregStat === 'Success' || p.PregStat === 'Given Birth'}><IonIcon slot="icon-only" icon={alertOutline} /></IonItemOption>
                                    <IonItemOption color="warning" onClick={() => setIsOpen(true)} disabled={p.PregStat === 'Failed' || p.PregStat === 'On Going'}><IonIcon slot="icon-only" icon={chevronBackOutline} /></IonItemOption>
                                </IonItemOptions>
                                <IonItem>
                                <IonLabel><h1>{date} <IonBadge>{p.PregStat}</IonBadge></h1><small>Breed Date: {date2} | Exp Due: {p.ExpDueDate} | Father: {p.name}</small></IonLabel>
                            </IonItem>
                            </IonItemSliding>
                        </IonItem>
                    )
            })}

            {PregnancyData?.map((pm)=>(
                <IonModal key={`key-${pm.PregId}`} ref={modalPregnancy} trigger={`preg-${pm.PregId}`} initialBreakpoint={0.6} breakpoints={[0, 1]}>
                    <div className="ion-text-center"><h1>Edit</h1></div>
                    <IonContent className="ion-padding">
                        <IonRow>
                            <IonInput label="Actual Date Confirmed" labelPlacement="floating" value={pm.dateConfirmed} disabled></IonInput>
                        </IonRow>
                        <IonRow>
                            <IonInput type="date" label="Expected Due Date" labelPlacement="floating" value={ExpDue} onIonInput={(e)=>setExpDue(e.target.value as string)}> </IonInput>
                        </IonRow>
                        <IonButton className="ion-top-margin" expand="block" onClick={()=>UpdateExpDue(ExpDue, pm.PregId)}>Update</IonButton>
                    </IonContent>
                    
                </IonModal>
            ))}

          <IonModal isOpen={isOpen} initialBreakpoint={0.7} breakpoints={[0, 1]}>
              <IonContent className="ion-padding">
                <h2 className="ion-text-center ion-margin-bottom">Birth Information</h2>
                <IonRow className="ion-margin-bottom">
                  <IonInput type="number" label="Total # Offspring" labelPlacement="floating" value={Offspring} onIonInput={(e)=>setOffSpring(e.target.value as number)}></IonInput>
                </IonRow>
                <IonRow className="ion-margin-bottom">
                  <IonInput type="number" label="Number Alive" labelPlacement="floating" value={Alive} onIonInput={(e)=>setAlive(e.target.value as number)}></IonInput>
                </IonRow>
                <IonRow className="ion-margin-bottom">
                  <IonInput type="number" label="# of Male" labelPlacement="floating" value={male} onIonInput={(e)=>setMale(e.target.value as number)}></IonInput>
                </IonRow>
                <IonRow className="ion-margin-bottom">
                  <IonInput type="number" label="# of Female" labelPlacement="floating" value={female} onIonInput={(e)=>setFemale(e.target.value as number)}></IonInput>
                </IonRow>
                <IonButton className="ion-margin-top" expand="full" onClick={()=>givenBirth(pregnancy_id, Offspring, Alive, male, female, breed_id, motherName, animal_id, father_id)}>Save</IonButton>
              </IonContent>
              
          </IonModal>

        </div>
                      {/* PREGNANCY ------------------------------------------------------------------------------------------------------------*/}
                    </div>
                </IonTab>
                <IonTabBar slot="bottom">
              <IonTabButton tab="animal">
                <IonIcon icon={listOutline} />Animal
                </IonTabButton>
               
               
                {gender === "Female" ? (
                <IonTabButton tab="estrus">
                  <IonIcon icon={bonfireOutline} />Estrus
                </IonTabButton>
                  
                ): null}
                {gender === "Female" ? (
                <IonTabButton tab="pregnancy">
                <IonIcon icon={happyOutline} />Pregnancy
              </IonTabButton>
                  
                ): null}
              </IonTabBar>
              </IonTabs>
            </IonContent>
            
           </IonModal>
          ))}

        </IonContent>

        
        {/*ADDD HEREEEE*/}

        <IonModal ref={modal} trigger="addAnimal" initialBreakpoint={0.8} breakpoints={[0, 1]}>
                <IonContent className="ion-padding">
                    <IonRow>
                        <IonCol className="ion-text-center">
                            <h2>Add Animal</h2>
                        </IonCol>
                    </IonRow>
                    <IonRow className="ion-margin-bottom">
                        <IonInput
                           label="Name"
                           labelPlacement="floating"
                           value={name}
                           onIonInput={(e)=>setName(e.target.value as string)}
                        ></IonInput>
                    </IonRow>
                   
                    <IonRow className="ion-margin-bottom">
                      <IonCol>
                        <IonSelect label="Animal" labelPlacement="floating" value={animalType} onIonChange={(e)=>selectedAnimalType(e.target.value as number)}>
                           {animalTypeData?.map((ty)=>(
                              <IonSelectOption key={ty.id} value={ty.id}>{ty.type}</IonSelectOption>
                           ))}
                        </IonSelect>
                      </IonCol>
                      <IonCol>
                        <IonSelect label="Breed" labelPlacement="floating" onIonChange={(e)=>setBreed(e.target.value as number)}>
                          
                            {breedData?.map((b)=>(
                              <IonSelectOption key={b.id} value={b.id}>{b.breed}</IonSelectOption>
                            ) )}
                        </IonSelect>
                      </IonCol>
                    </IonRow>
                    <IonRow className="ion-margin-bottom">
                  <IonCol>
                    <IonSelect label="Mother" labelPlacement="floating" value={selectedMother} onIonChange={(e)=>setSelectedMother(e.target.value as number)}>
                      <IonSelectOption value={0}>Unknown</IonSelectOption>
                        {AddMotherData?.map((mother)=>(
                          <IonSelectOption key={mother.id} value={mother.id}>{mother.name}</IonSelectOption>
                        ))}
                    </IonSelect>
                  </IonCol>
                  <IonCol>
                    <IonSelect label="Father" labelPlacement="floating" value={selectedFather} onIonChange={(e)=>setSelectedFather(e.target.value as number)}>
                    <IonSelectOption value={0}>Unknown</IonSelectOption>
                        {addFatherData?.map((father)=>(
                          <IonSelectOption key={father.id} value={father.id}>{father.name}</IonSelectOption>
                        ))}
                    </IonSelect>
                  </IonCol>
                </IonRow>
                    <IonRow>
                      <IonCol>
                        <IonSelect label="Gender" labelPlacement="floating" value={gender} onIonChange={(e)=>setGender(e.target.value as string)}>
                           <IonSelectOption value={"Male"}>Male</IonSelectOption>
                           <IonSelectOption value={"Female"}>Female</IonSelectOption>
                        </IonSelect>
                      </IonCol>
                      <IonCol>
                        <IonInput className="ion-margin-bottom"
                        type="date"
                        label="Date of Birth"
                        labelPlacement="floating"
                        value={birthdate}
                        onIonChange={(e) => setBirthdate(e.detail.value!)}
                        >
                          </IonInput>
                      </IonCol>
                     
                    </IonRow>
                      <IonRow>
                        <IonSelect label="Health" labelPlacement="floating" className="ion-margin-bottom" value={health} onIonChange={(e)=>setHealth(e.target.value as number)}>
                            {healthDatah?.map((h)=> (
                              <IonSelectOption key={h.id} value={h.id}>{h.status}</IonSelectOption>
                            ))}
                        </IonSelect>
                      </IonRow>
                      {gender === "Female" ?( <IonRow>
                        
                      </IonRow> ) : null}
                    <IonButton expand="block" className="ion-margin-top" onClick={() => addNewAnimal(breed, gender, birthdate, health, pregnancy, name, selectedMother, selectedFather)}>Add</IonButton>
                </IonContent>
                
               </IonModal>
        <IonFab id="addAnimal" slot="fixed" vertical="bottom" horizontal="end">
            <IonFabButton>
                <IonIcon icon={add} onClick={NewAnimal}></IonIcon>
            </IonFabButton>
            
        </IonFab>
      </IonPage>
        </>
       

    );
};
export default AddAnimal