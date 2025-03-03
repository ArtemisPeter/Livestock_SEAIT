import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  IonAlert,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonModal,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  RefresherEventDetail,
  useIonAlert,
} from "@ionic/react";

import SideBar from "./SideBar";
import { barcodeOutline } from "ionicons/icons";
import Html5QrcodePlugin from "../components/Html5QrcodePlugin";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import useSQLiteDB from "../composables/useSQLiteDB";
import * as XLSX from "xlsx";
import Animal from "./Animal";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";

import { Capacitor } from "@capacitor/core";

import { saveAs } from "file-saver"; // Import FileSaver.js
//import { updateAnimalProfile } from "../utils/EditReport";

type Animal = {
  id: number; 
  breed_id: number; 
  breed: string; 
  gender: string; 
  birthdate: string; 
  health_status_id: number; 
  Health_Status: string; 
  pregnancy_status: number; 
  name: string;
  AnimalKind: string;
  
}

type Feeds = {
  animal_id: number;
  id: number;
  feeds: string;
  remarks: string;
  feeds_id: number;
  status: number;
  dateCreated: string
}

type Supplement = {
  animal_id: number;
  id: number;
  supplement: string;
  remarks: string;
  sup_id: number;
  status: number;
  dateCreated: string
}

type Disease = {
  animal_id: number;
  id: number;
  disease: string;
  vaccines: string;
  remarks: string;
  status: number;
  firstDateCreated: string;
  lastDateCured: string
}

type Parents = {
  Father: string;
  Mother:string
}

type BreedHistory = {
  Parity: number, 
  TotalAlive: number, 
  TotalDead: number, 
  TotalFemale: number, 
  TotalMale: number
  Total_Num_Births: number
}

type BreedingHistoryDetailed = {
  EH_Status:number,
  OnHeat:string,
  EHStatus:string,
  Male:number,
  type:string,
  Breeder_Date:string, 
  fname:string, 
  lname: string,
  EDStatus:string,
  remarks:string,
  dateConfirmed:string,
  ActualDueDate:string, 
  PStatus:string, 
  dateFailed:string, 
  actualDate:string, 
  OffspringNum:number,
  DeadNum:number, 
  AliveNum:number, 
  SexMnum:number,
  SexFNum:number
}

type AnimalDetailedData = {
  // Animal details
  AnimalId: number,
  AnimalName: string,
  AnimalType: string,
  BreedName: string,
  HealthStatus: string,
  birthdate: string,
  gender: string,
  pregnancy_status: number,

  // Feeds details
  FeedName: string,
  FeedRemarks: string,

  // Supplements details
  SupplementName: string,
  SupplementRemarks: string,

  // Disease details
  DiseaseName: string,
  DiseaseRemarks: string,
  DiseaseDateCreated: string,
  DiseaseDateCured: string,

  // Parent details
  MotherName: string,
  FatherName: string,

  // Breeding history
  BirthRecordId: number,
  OffspringCount: number,
  AliveCount: number,
  DeadCount: number,
  MaleCount: number,
  FemaleCount: number
}

type TotalLiveStockDetailed = {
  AnimalID: number, 
  AnimalName: string, 
  AnimalBreed: string, 
  AnimalType: string, 
  AnimalGender: string, 
  AnimalBday: string, 
  HealthStatus: string, 
  PregnancyStatus: string,
  Mother: string,
  Father:string
}

type TotalPregnancyDetailed = {
  AnimalID: number, 
  AnimalName: string, 
  AnimalBreed: string, 
  AnimalType: string, 
  AnimalGender: string, 
  AnimalBday: string, 
  HealthStatus: string, 
  PregnancyStatus: string,
  DateOnHeat: string, 
  EstrusStatus:string, 
  BreedDate:string, 
  AnimalMale:string, 
  BreedingType:string,
  Breeder:string,
  BreedingRemarks:string, 
  PregnancyDateConfirmed:string, 
  PregnancyExpDue:string, 
  PregnancyActualDue:string, 
  PregnancyOnStatus:string, 
  TotalOffspring:number,
  TotalAlive:number,
  TotalDead:number, 
  TotalMale:number, 
  TotalFemale:number,
  GivenBirth: string
}

type TotalSickDetailed = {
  AnimalID: number, 
  AnimalName: string, 
  AnimalBreed: string, 
  AnimalType: string, 
  AnimalGender: string, 
  AnimalBday: string, 
  HealthStatus: string, 
  PregnancyStatus: string,
  Disease:string,
  Vet:string, 
  DateNoticed:string,
  SickStatus:string,
  DateCured:string,
  Vaccine_Supplement:string,
  VaccineRemarks:string,
  status:string
}

const Landing: React.FC = () => {
  const [scannedID, setScannedId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [animalData, setAnimalData] = useState<Array<Animal>>([]);
  const { performSQLAction, initialized } = useSQLiteDB();
  const modal = useRef<HTMLIonModalElement>(null);
  const [FeedsData, setFeedsData] = useState<Array<Feeds>>([]);
  const [SupplementData, setSupplementData] = useState<Array<Supplement>>([]);
  const [DiseaseData, setDiseaseData] = useState<Array<Disease>>([]);
  const [ParentsData, setParentsData] = useState<Array<Parents>>([]);
  const [BreedHistory, setBreedHistory] = useState<Array<BreedHistory>>([]);
  const [BreedDetails, setBreedDetails] = useState<Array<BreedingHistoryDetailed>>([])
  const [TotalLiveStock, setLiveStock] = useState(0);
  const [TotalPregy, setTotalPregy] = useState(0);
  const [TotalSick, setTotalSick] = useState(0);
  const [TotalEstrus, setTotalEstrus] = useState(0);
  const [AnimalDetailedData, setAnimalDetailedData] = useState<Array<AnimalDetailedData>>([])
  const [TotalLiveStockDetailed, setLiveStockDetailed] = useState<Array<TotalLiveStockDetailed>>([])
  const [TotalPregnancyDetailed, setPregnancyDetailed] = useState<Array<TotalPregnancyDetailed>>([])
  const [TotalSickDetailed, setSickDetailed] = useState<Array<TotalSickDetailed>>([])
  const [alertData, setAlertData] = useState<any>(null)
  const [presentAlert] = useIonAlert();

  useEffect(()=>{
    LoadTotalLiveStock();
    LoadTotalPreg();
    LoadTotalSick();
    LoadEstrus();
    LoadTotalLiveStockDetailed();
    LoadPregnancyDetailed();
    LoadTotalSickDetailed();
  }, [initialized])

  const refreshtThePage = (event: CustomEvent<RefresherEventDetail>)=>{
      setTimeout(()=>{
        LoadTotalLiveStock();
        LoadTotalPreg();
        LoadTotalSick();
        LoadEstrus();
        LoadTotalLiveStockDetailed();
        LoadPregnancyDetailed();
        LoadTotalSickDetailed();
        event.detail.complete();
      }, 2000)
  }


  
  const exportToExcel = async (data: any[], fileName: string) => {
    try {
      // Step 1: Create a workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  
      // Step 2: Generate Excel file as binary
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
  
      // Step 3: Check platform and save the file
      const platform = Capacitor.getPlatform();
  
      if (platform === "web") {
        // Append timestamp to avoid overwriting
        const timestamp = new Date().getTime();
        const newFileName = `${fileName.replace(".xlsx", "")}_${timestamp}.xlsx`;
        
        saveAs(blob, newFileName);
        alert(`File downloaded as ${newFileName}`);
      } else {
        // Mobile: Check if file exists and rename if necessary
        let newFileName = fileName;
        let fileExists = await checkFileExists(fileName);
  
        if (fileExists) {
          const timestamp = new Date().getTime();
          newFileName = `${fileName.replace(".xlsx", "")}_${timestamp}.xlsx`;
        }
  
        const base64Data = await blobToBase64(blob);
        await Filesystem.writeFile({
          path: newFileName,
          data: base64Data,
          directory: Directory.Documents,
        });
  
        alert(`File saved successfully as ${newFileName}!`);
      }
    } catch (error) {
      console.error(`Error exporting file:`, error);
      alert(`Failed to export file.`);
    }
  };
  
  // Function to check if a file exists
  const checkFileExists = async (fileName: string): Promise<boolean> => {
    try {
      await Filesystem.stat({ path: fileName, directory: Directory.Documents });
      return true; // File exists
    } catch (error) {
      return false; // File does not exist
    }
  };
  const handleExport = async () => {
    if (!AnimalDetailedData || AnimalDetailedData.length === 0) {
      alert("Animal data is empty or not loaded.");
      return;
    }
    await exportToExcel(AnimalDetailedData, "AnimalDatas.xlsx");
  };
  
  const handleExportTotalLivestock = async () => {
    await LoadTotalLiveStockDetailed(); // Wait for data to load
    if (!TotalLiveStockDetailed || TotalLiveStockDetailed.length === 0) {
      alert("Livestock data is empty or not loaded.");
      return;
    }
    await exportToExcel(TotalLiveStockDetailed, "AnimalLivestocks.xlsx");
  };
  
  const handleExportTotalPregnancy = async () => {
    await LoadPregnancyDetailed(); // Wait for data to load
    if (!TotalPregnancyDetailed || TotalPregnancyDetailed.length === 0) {
      alert("Pregnancy data is empty or not loaded.");
      return;
    }
    await exportToExcel(TotalPregnancyDetailed, "AnimalPregnancies.xlsx");
  };
  

  
  const handleExportTotalSick = async () => {
    await LoadTotalSickDetailed(); // Wait for data to load
    if (!TotalSickDetailed || TotalSickDetailed.length === 0) {
      alert("Sick data is empty or not loaded.");
      return;
    }
    await exportToExcel(TotalSickDetailed, "AnimalSicks.xlsx");
  };
  
  
  // Helper function to convert Blob to Base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(",")[1]); // Remove "data:..." prefix
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };


  const onNewScanResult = (decodedText: string, decodedResult: any) => {
    const str = decodedText;
    const theId = str.split(" - ")[0];
    console.log("Scanned ID: ", theId);
    console.log(isOpen);

    setIsOpen(false); // Close the modal if it’s already open

  
    setTimeout(() => {
      setScannedId(theId);
      setIsOpen(true); // Open the modal after setting data
      loadAnimal(theId);
      LoadFeeds(theId);
      LoadSupp(theId);
      // LoadDisease(theId); // Commented as per your current setup
      LoadGroupedDisease(theId);
      loadParents(theId);
      loadBreedingHistory(theId);
      loadBreedHeader(theId);
      loadBreedDetails(theId);
      loadAnimalData(theId);
      LoadSupplement(theId)
    }, 0); // Delay execution slightly to ensure modal's state change is handled properly
  };
  
  

  const loadAnimal = (theScannedId: any) => {
    try {
      performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        const data = await db?.query(`SELECT Animal.id, 
          Animal.breed_id, Breed.breed, 
          Animal.gender, Animal.birthdate, 
          Animal.health_status_id, 
          Health_Status.status AS Health_Status, 
          pregnancy_status, Animal.name,
          Animal_Type.type AS AnimalKind, 
          animal_father_id AS Father, 
          animal_mother_id As Mother
          FROM Animal 
          INNER JOIN Breed ON Breed.id = Animal.breed_id 
          INNER JOIN Health_Status ON Health_Status.id = Animal.health_status_id
          INNER JOIN Animal_Type ON Breed.Animal_Type_id = Animal_Type.id
          WHERE Animal.id = ?`, [theScannedId]);
        
        console.log("Data loaded: ", data?.values); // Debug log
        if (data?.values.length) {
          setAnimalData(data.values);
        } else {
          console.log("No data found for ID: ", theScannedId); // Debug log
          setAnimalData([]); // Clear data if none found
        }
      });
    } catch (error) {
      console.log("Error loading animal data: ", (error as Error).message); // More detailed error logging
      setAnimalData([]);
    }
  };

  const LoadFeeds = (theScannedId: string) =>{
    try {
      performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        const data = await db?.query(`SELECT Animal.id, FAH.id, F.feeds,
          FAD.feeds_remarks as remarks, FAD.feeds_id, FAD.status, FAD.dateCreated
          FROM Animal 
          INNER JOIN Feed_Animal_Header AS FAH ON FAH.id = Animal.id
          INNER JOIN Feed_Animal_Details_Feeds AS FAD ON FAD.Feed_Animal_Header = FAH.id
          INNER JOIN Feeds as F ON F.id = FAD.feeds_id
          WHERE Animal.id = ?`, [theScannedId]);
        
        console.log("Data loaded FEEDS: ", data?.values); // Debug log
        if (data?.values.length) {
          setFeedsData(data.values);
          console.log(data)
        } else {
          console.log("No data found for ID: ", theScannedId); // Debug log
          setFeedsData([]); // Clear data if none found
        }
      });
    } catch (error) {
      console.log("Error loading animal data: ", (error as Error).message); // More detailed error logging
      setFeedsData([]);
    }
  }

  const LoadSupplement = (theScannedId: string) =>{
    try {
      performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        const data = await db?.query(`SELECT Animal.id, FAH.id, F.Vaccine_Supplement,
          FAS.Supplement_Remarks as remarks, FAS.Vaccine_Supplement_id, FAS.status, FAS.dateCreated
          FROM Animal 
          INNER JOIN Feed_Animal_Header AS FAH ON FAH.id = Animal.id
          INNER JOIN Feed_Animal_Details_Supplement AS FAS ON FAS.Feed_Animal_Header = FAH.id
          INNER JOIN Vaccine_Supplement as F ON F.id = FAS.Vaccine_Supplement_id
          WHERE Animal.id = ?`, [theScannedId]);
        
        console.log("Supplement: ", data?.values); // Debug log
        if (data?.values.length) {
          //setFeedsData(data.values);
          console.log(data)
        } else {
          console.log("No data found for ID: ", theScannedId); // Debug log
          //setFeedsData([]); // Clear data if none found
        }
      });
    } catch (error) {
      console.log("Error loading animal data: ", (error as Error).message); // More detailed error logging
      //setFeedsData([]);
    }
  }

  const LoadSupp = (theScannedId: string) =>{
    try {
      performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        const data = await db?.query(`SELECT Animal.id, FAH.id, F.Vaccine_Supplement as supplement,
          FAD.Supplement_Remarks as remarks, FAD.Vaccine_Supplement_id, FAD.status
          FROM Animal 
          INNER JOIN Feed_Animal_Header AS FAH ON FAH.id = Animal.id
          INNER JOIN Feed_Animal_Details_Supplement AS FAD ON FAD.Feed_Animal_Header = FAH.id
          INNER JOIN Vaccine_Supplement as F ON F.id = FAD.Vaccine_Supplement_id
          WHERE Animal.id = ?`, [theScannedId]);
        
        console.log("Data loadedSUPP: ", data?.values); // Debug log
        if (data?.values.length) {
          setSupplementData(data.values);
          console.log(data)
        } else {
          console.log("No data found for ID: ", theScannedId); // Debug log
          setSupplementData([]); // Clear data if none found
        }
      });
    } catch (error) {
      console.log("Error loading animal data: ", (error as Error).message); // More detailed error logging
      setSupplementData([]);
    }
  }

  /*const LoadDisease = (theScannedId: string) =>{
    try {
      performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        const data = await db?.query(`SELECT Animal.id AS animalId, 
            FAH.id AS diseaseHeaderId, 
            D.disease AS disease, 
            F.Vaccine_Supplement AS vaccine, 
            FAD.remarks AS remarks, 
            FAD.vaccine_supplement_id AS vaccineSupplementId, 
            FAH.status AS status, 
            FAD.dateCreated AS dateCreated, 
            FAH.dateCured AS dateCured
         FROM Animal 
         INNER JOIN Disease_Animal_Header AS FAH ON FAH.animal_id = Animal.id
         INNER JOIN Disease_Animal_Detail AS FAD ON FAD.disease_animal_header_id = FAH.id
         INNER JOIN Vaccine_Supplement AS F ON F.id = FAD.vaccine_supplement_id
         INNER JOIN Disease AS D ON D.id = FAD.disease_id
         WHERE Animal.id = ?`, [theScannedId]);
        
        console.log("Data loaded: ", data?.values); // Debug log
        if (data?.values.length) {
          setDiseaseData(data.values);
          console.log(data)
        } else {
          console.log("No data found for ID: ", theScannedId); // Debug log
          setDiseaseData([]); // Clear data if none found
        }
      });
    } catch (error) {
      console.log("Error loading animal data: ", (error as Error).message); // More detailed error logging
      setSupplementData([]);
    }
  } */

  const LoadGroupedDisease = (theScannedId: string) => {
    try {
      performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        const data = await db?.query(`SELECT Animal.id AS animalId, 
            FAH.id AS id, 
            D.disease AS disease, 
            GROUP_CONCAT(F.Vaccine_Supplement, ', ') AS vaccines, 
            GROUP_CONCAT(FAD.remarks, ', ') AS remarks, 
            FAH.status AS status, 
            MIN(FAD.dateCreated) AS firstDateCreated, 
            MAX(FAH.dateCured) AS lastDateCured
         FROM Animal 
         INNER JOIN Disease_Animal_Header AS FAH ON FAH.animal_id = Animal.id
         LEFT JOIN Disease_Animal_Detail AS FAD ON FAD.disease_animal_header_id = FAH.id
         INNER JOIN Vaccine_Supplement AS F ON F.id = FAD.vaccine_supplement_id
         INNER JOIN Disease AS D ON D.id = FAD.disease_id
         WHERE Animal.id = ?
         GROUP BY FAH.id, D.id`, [theScannedId]);
  
        console.log("Grouped data loaded: ", data?.values); // Debug log
        if (data?.values.length) {
          setDiseaseData(data.values);
          console.log(data);
        } else {
          console.log("No data found for ID: ", theScannedId); // Debug log
          setDiseaseData([]); // Clear data if none found
        }
      });
    } catch (error) {
      console.log("Error loading grouped disease data: ", (error as Error).message); // More detailed error logging
      setSupplementData([]);
    }
  }

  const loadParents = (theScannedId: string) =>{
    try {
      performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        const data = await db?.query(`
              SELECT 
                Mother.name AS Mother, 
                Father.name AS Father
              FROM Animal AS Child
              INNER JOIN Animal AS Father ON Father.id = Child.animal_father_id
              INNER JOIN Animal AS Mother ON Mother.id = Child.animal_mother_id
             
              WHERE Child.id = ?
          `, [theScannedId]);
  
        console.log("Parents: ", data?.values); // Debug log
        if (data?.values.length) {
          setParentsData(data.values);
          console.log(data);
        } else {
          console.log("Parents: ", theScannedId); // Debug log
          setParentsData([]); // Clear data if none found
        }
      });
    } catch (error) {
      console.log("Error loading grouped disease data: ", (error as Error).message); // More detailed error logging
      setParentsData([]);
    }
  }

  const loadBreedingHistory = (theScannedId: string) =>{
    try {
      performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        const data = await db?.query(`
           SELECT COUNT(EH.id) AS Parity, 
           SUM(BPH.OffspringNum) AS Total_Num_Births, 
           SUM(BPH.AliveNum) AS TotalAlive,
           SUM(BPH.DeadNum) AS TotalDead, 
           SUM(BPH.SexMnum) AS TotalMale,
           SUM(BPH.SexFNum) AS TotalFemale
           FROM Estrus_Head AS EH 
           INNER JOIN Estrus_Details AS ED ON ED.Estrus_Head = EH.id
           LEFT JOIN Pregnancy AS P ON P.estrus_details_id = ED.id
           LEFT JOIN Birth_Pregnanc_Head AS BPH ON BPH.pregnancy_id = P.id
           LEFT JOIN Person AS Pe ON Pe.id = ED.breeder_id
           WHERE EH.animal_id = ?
           GROUP BY EH.animal_id
           
          `, [theScannedId]);
  
        console.log("BreedSSDSDSDS: ", data?.values); // Debug log
        if (data?.values.length) {
         setBreedHistory(data?.values)
          console.log(data);
        } else {
          console.log("Breed: ", theScannedId); // Debug log
          setBreedHistory([]);
        }
      });
    } catch (error) {
      console.log("Error loading grouped disease data: ", (error as Error).message); // More detailed error logging
      //setParentsData([]);
    }
  }

  const loadBreedHeader = (theScannedId: string) =>{
    try {
      performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        const data = await db?.query(`
           SELECT 
           EH.dateCreated as OnHeat, 
           Eh.status AS EHStatus

           FROM Estrus_Head AS EH 
           INNER JOIN Estrus_Details AS ED ON ED.Estrus_Head = EH.id
           LEFT JOIN Pregnancy AS P ON P.estrus_details_id = ED.id
           LEFT JOIN Birth_Pregnanc_Head AS BPH ON BPH.pregnancy_id = P.id
           LEFT JOIN Person AS Pe ON Pe.id = ED.breeder_id
           WHERE EH.animal_id = ?
           
          `, [theScannedId]);
  
        console.log("Breed: ", data?.values); // Debug log
        if (data?.values.length) {
         //setBreedHistory(data?.values)
          console.log(data);
        } else {
          console.log("Breed: ", theScannedId); // Debug log
          // Clear data if none found
        }
      });
    } catch (error) {
      console.log("Error loading grouped disease data: ", (error as Error).message); // More detailed error logging
      //setParentsData([]);
    }
  }

  const loadBreedDetails = (theScannedId: string) =>{
    try {
      performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        const data = await db?.query(`
           SELECT 
           EH.status AS EH_Status,
           EH.dateCreated as OnHeat,
           EH.status as EHStatus,
           A.name AS Male,
           ED.type,
           ED.Breeder_Date, 
           Pe.fname, 
           Pe.lname,
           ED.Status as EDStatus,
           ED.remarks,
           P.dateConfirmed,
           P.ActualDueDate, 
           P.status AS PStatus, 
           P.dateFailed, 
           BPH.actualDate, 
           BPH.OffspringNum,
           BPH.DeadNum, 
           BPH.AliveNum, 
           BPH.SexMnum,
           BPH.SexFNum
           FROM Estrus_Head AS EH 
           INNER JOIN Estrus_Details AS ED ON ED.Estrus_Head = EH.id
           LEFT JOIN Pregnancy AS P ON P.estrus_details_id = ED.id
           LEFT JOIN Birth_Pregnanc_Head AS BPH ON BPH.pregnancy_id = P.id
           LEFT JOIN Person AS Pe ON Pe.id = ED.breeder_id
           LEFT JOIN Animal as A ON A.id = ED.animal_id_male
           WHERE EH.animal_id = ?
           GROUP BY EH.id
          `, [theScannedId]);
  
        console.log("Detailed: ", data?.values); // Debug log
        if (data?.values.length) {
          setBreedDetails(data?.values)
          console.log(data);
        } else {
          console.log("Breed: ", theScannedId); // Debug log
          setBreedDetails([])// Clear data if none found
        }
      });
    } catch (error) {
      console.log("Error loading grouped disease data: ", (error as Error).message); // More detailed error logging
      //setParentsData([]);
    }
  }

  const loadAnimalData = (theScannedId: any) => {
    try {
      performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        const query = `
           SELECT 
 
          Animal.id AS AnimalId, 
          Animal.name AS AnimalName, 
          Animal.gender, 
          Animal.birthdate, 
          Animal.pregnancy_status, 
          Animal_Type.type AS AnimalType, 
          Breed.breed AS BreedName, 
          Health_Status.status AS HealthStatus,
          Feeds.feeds AS FeedName,
          Feed_Animal_Details_Feeds.feeds_remarks AS FeedRemarks,
          Vaccine_Supplement.Vaccine_Supplement AS SupplementName,
          Feed_Animal_Details_Supplement.Supplement_Remarks AS SupplementRemarks,
          Disease.disease AS DiseaseName,
          Disease_Animal_Detail.remarks AS DiseaseRemarks,
          Disease_Animal_Header.dateCreated AS DiseaseDateCreated,
          Disease_Animal_Header.dateCured AS DiseaseDateCured,
          MotherAnimal.name AS MotherName,
          FatherAnimal.name AS FatherName,
          Birth_Pregnanc_Head.id AS BirthRecordId,
          Birth_Pregnanc_Head.OffspringNum AS OffspringCount,
          Birth_Pregnanc_Head.AliveNum AS AliveCount,
          Birth_Pregnanc_Head.DeadNum AS DeadCount,
          Birth_Pregnanc_Head.SexMnum AS MaleCount,
          Birth_Pregnanc_Head.SexFNum AS FemaleCount
        FROM Animal
        LEFT JOIN Breed ON Breed.id = Animal.breed_id
        LEFT JOIN Animal_Type ON Animal_Type.id = Breed.Animal_Type_id
        LEFT JOIN Health_Status ON Health_Status.id = Animal.health_status_id
        LEFT JOIN Feed_Animal_Header ON Feed_Animal_Header.animal_id = Animal.id
        LEFT JOIN Feed_Animal_Details_Feeds ON Feed_Animal_Details_Feeds.Feed_Animal_Header = Feed_Animal_Header.id
        LEFT JOIN Feeds ON Feeds.id = Feed_Animal_Details_Feeds.feeds_id
        LEFT JOIN Feed_Animal_Details_Supplement ON Feed_Animal_Details_Supplement.Feed_Animal_Header = Feed_Animal_Header.id
        LEFT JOIN Vaccine_Supplement ON Vaccine_Supplement.id = Feed_Animal_Details_Supplement.Vaccine_Supplement_id
        LEFT JOIN Disease_Animal_Header ON Disease_Animal_Header.animal_id = Animal.id
        LEFT JOIN Disease_Animal_Detail ON Disease_Animal_Detail.disease_animal_header_id = Disease_Animal_Header.id
        LEFT JOIN Disease ON Disease.id = Disease_Animal_Detail.disease_id
        LEFT JOIN Estrus_Head ON Estrus_Head.animal_id = Animal.id
        LEFT JOIN Estrus_Details ON Estrus_Details.Estrus_Head = Estrus_Head.id
        LEFT JOIN Pregnancy ON Pregnancy.estrus_details_id = Estrus_Details.id
        LEFT JOIN Birth_Pregnanc_Head ON Birth_Pregnanc_Head.pregnancy_id = Pregnancy.id
        LEFT JOIN Animal AS MotherAnimal ON MotherAnimal.id = Estrus_Head.animal_id
        LEFT JOIN Animal AS FatherAnimal ON FatherAnimal.id = Estrus_Details.animal_id_male
        WHERE Animal.id = ?
        `;
  
        const result = await db?.query(query, [theScannedId]);
        console.log("Loaded Unifed: ", result?.values);
  
        if (result?.values.length) {
          setAnimalDetailedData(result.values); // Assuming you set the state with this function
          console.log(AnimalDetailedData)
        } else {
          console.log("No data found for the given ID.");
          setAnimalDetailedData([]);
        }
      });
    } catch (error) {
      console.error("Error loading animal data: ", error.message);
    }
  };
  
  
  

  const LoadTotalLiveStock = () =>{
    try {
      performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        const data = await db?.query(`
            SELECT COUNT(*) AS tlive FROM Animal
          `);
        if (data?.values.length) {
         setLiveStock(data?.values[0].tlive)
          console.log(data?.values[0].tlive);
        } 
      });
    } catch (error) {
      console.log("Error loading grouped disease data: ", (error as Error).message); // More detailed error logging
      //setParentsData([]);
    }
  }

  const LoadTotalLiveStockDetailed = () =>{
    try {
      performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        const data = await db?.query(`
            SELECT 
            A.id AS 'AnimalID', 
            A.name AS 'AnimalName',
            B.breed AS 'AnimalBreed',
            ATY.type AS 'AnimalType',
            A.gender AS 'AnimalGender',
            A.birthdate AS 'AnimalBday',
            HS.status AS 'HealthStatus',
            CASE  
              WHEN A.pregnancy_status = 1 THEN 'Pregnant'
              ELSE 'Not Pregnant'
            END AS 'PregnancyStatus',
            Mother.name AS Mother, 
            Father.name AS Father
            FROM Animal AS A 
            INNER JOIN Breed AS B ON B.id = A.breed_id
            INNER JOIN Animal_Type AS ATY ON ATY.id = B.Animal_Type_id
            INNER JOIN Health_Status AS HS ON HS.id = A.health_status_id
            LEFT JOIN Animal AS Father ON Father.id = A.animal_father_id
            LEFT JOIN Animal AS Mother ON Mother.id = A.animal_mother_id
          `);
        if (data?.values.length) {
          setLiveStockDetailed(data.values)
          console.log('TOTAL LIVESTOCK', data?.values)
          //console.log(data?.values[0].tlive);
        } 
      });
    } catch (error) {
      console.log("Error loading grouped disease data: ", (error as Error).message); // More detailed error logging
      setLiveStockDetailed([]); 
    }
  }

  const LoadPregnancyDetailed = () =>{
    try {
      performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        const data = await db?.query(`
            SELECT 
            A.id AS 'AnimalID', 
            A.name AS 'AnimalName',
            B.breed AS 'AnimalBreed',
            ATY.type AS 'AnimalType',
            A.gender AS 'AnimalGender',
            A.birthdate AS 'AnimalBday',
            HS.status AS 'HealthStatus',
            CASE  
              WHEN A.pregnancy_status = 1 THEN 'Pregnant'
              ELSE 'Not Pregnant'
            END AS 'PregnancyStatus',
            EH.dateCreated AS 'DateOnHeat',
            EH.status AS 'EstrusStatus',
            ED.Breeder_Date AS 'BreedDate',
            A.name AS 'AnimalMale',
            ED.type AS 'BreedingType',
            ED.status AS 'BreedingStatus', 
            (PE.fname || ' ' || PE.lname) AS Breeder, 
            ED.remarks AS 'BreedingRemarks',
            P.dateConfirmed AS 'PregnancyDateConfirmed',
            P.ExpDueDate AS 'PregnancyExpDue', 
            P.ActualDueDate AS 'PregnancyActualDue',
            P.status AS 'PregnancyOnStatus',
            BPH.OffspringNum AS 'TotalOffspring',
             BPH.actualDate AS 'GivenBirth',
            BPH.AliveNum AS 'TotalAlive',
            BPH.DeadNum AS 'TotalDead',
            BPH.SexMnum AS 'TotalMale',
            BPH.SexFNum AS 'TotalFemale'
            FROM Animal AS A 
            LEFT JOIN Breed AS B ON B.id = A.breed_id
            LEFT JOIN Animal_Type AS ATY ON ATY.id = B.Animal_Type_id
            LEFT JOIN Health_Status AS HS ON HS.id = A.health_status_id
            LEFT JOIN Estrus_Head AS EH ON EH.animal_id = A.id
            LEFT JOIN Estrus_Details AS ED ON ED.Estrus_Head = EH.id
            LEFT JOIN Pregnancy AS P ON P.estrus_details_id = ED.id
            LEFT JOIN Birth_Pregnanc_Head AS BPH ON BPH.pregnancy_id = P.id
            LEFT JOIN Person AS PE ON PE.id = ED.breeder_id
            WHERE A.gender = 'Female' AND EH.dateCreated IS NOT NULL
          `);

         setPregnancyDetailed(data.values)
          console.log('TOTAL Pregnancy', data.values)
          //console.log(data?.values[0].tlive);

      });
    } catch (error) {
      console.log("Error loading grouped disease data: ", (error as Error).message); // More detailed error logging
      setPregnancyDetailed([]); 
    }
  }

  const LoadTotalSickDetailed = () =>{
    try {
      performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        const data = await db?.query(`
            SELECT 
            A.id AS 'AnimalID', 
            A.name AS 'AnimalName',
            B.breed AS 'AnimalBreed',
            ATY.type AS 'AnimalType',
            A.gender AS 'AnimalGender',
            A.birthdate AS 'AnimalBday',
            HS.status AS 'HealthStatus',
            CASE  
              WHEN A.pregnancy_status = 1 THEN 'Pregnant'
              ELSE 'Not Pregnant'
            END AS 'PregnancyStatus',
            D.disease AS Disease, 
            (PE.fname || ' ' || PE.lname) AS Vet, 
            DAH.dateCreated AS DateNoticed, 
            DAH.status AS 'SickStatus',
            DAH.dateCured AS DateCured,
            VS.Vaccine_Supplement,
            DAD.remarks AS VaccineRemarks, 
            DAD.status
            FROM Animal AS A 
            LEFT JOIN Breed AS B ON B.id = A.breed_id
            LEFT JOIN Animal_Type AS ATY ON ATY.id = B.Animal_Type_id
            LEFT JOIN Health_Status AS HS ON HS.id = A.health_status_id
            LEFT JOIN Disease_Animal_Header AS DAH ON DAH.animal_id = A.id
            LEFT JOIN Disease_Animal_Detail AS DAD ON DAD.disease_animal_header_id = DAH.id
            LEFT JOIN Disease AS D ON D.id = DAD.disease_id
            LEFT JOIN Person AS PE ON PE.id = DAH.vet_id
            LEFT JOIN Vaccine_Supplement AS VS ON VS.id = DAD.vaccine_supplement_id
            WHERE DAH.dateCreated IS NOT NULL
          `);

          setSickDetailed(data.values)
          console.log('TOTAL Sick', data?.values)
          //console.log(data?.values[0].tlive);

      });
    } catch (error) {
      console.log("Error loading grouped disease data: ", (error as Error).message); // More detailed error logging
      setSickDetailed([]); 
    }
  }

  const LoadTotalPreg = () =>{
    try {
      performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        const data = await db?.query(`
            SELECT COUNT(*) AS tpregy FROM Pregnancy WHERE status = 'On Going'
          `);
        if (data?.values.length) {
         setTotalPregy(data?.values[0].tpregy)
          console.log(data?.values[0].tpregy);
        } 
      });
    } catch (error) {
      console.log("Error loading grouped disease data: ", (error as Error).message); // More detailed error logging
      //setParentsData([]);
    }
  }

  const LoadTotalSick = () =>{
    try {
      performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        const data = await db?.query(`
            SELECT COUNT(*) AS tsick FROM Disease_Animal_Header WHERE status = 0
          `);
        if (data?.values.length) {
          setTotalSick(data?.values[0].tsick)
          console.log(data?.values[0].tsick);
        } 
      });
    } catch (error) {
      console.log("Error loading grouped disease data: ", (error as Error).message); // More detailed error logging
      //setParentsData([]);
    }
  }

  const LoadTotalSickData = () =>{
    try {
      performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        const data = await db?.query(`
          SELECT 
              Animal.id AS AnimalId,
              Animal.name AS AnimalName,
              Animal.gender,
              Animal.birthdate,
              Animal_Type.type AS AnimalType,
              Breed.breed AS BreedName,
              Health_Status.status AS HealthStatus,
              Disease.disease AS DiseaseName,
              Disease_Animal_Header.dateCreated AS DiseaseReportedDate,
              Disease_Animal_Header.dateCured AS DiseaseCuredDate,
              Disease_Animal_Header.status AS DiseaseStatus,
              Disease_Animal_Detail.remarks AS DiseaseRemarks,
              Person.fname || ' ' || Person.lname AS VetName
          FROM Animal
          -- Joins for breed, type, and health status
          LEFT JOIN Breed ON Breed.id = Animal.breed_id
          LEFT JOIN Animal_Type ON Animal_Type.id = Breed.Animal_Type_id
          LEFT JOIN Health_Status ON Health_Status.id = Animal.health_status_id

          -- Joins for diseases
          INNER JOIN Disease_Animal_Header ON Disease_Animal_Header.animal_id = Animal.id
          INNER JOIN Disease_Animal_Detail ON Disease_Animal_Detail.disease_animal_header_id = Disease_Animal_Header.id
          LEFT JOIN Disease ON Disease.id = Disease_Animal_Detail.disease_id

          -- Joins for vet information
          LEFT JOIN Person ON Person.id = Disease_Animal_Header.vet_id

          -- Only include animals that are currently sick
          WHERE Disease_Animal_Header.status = 0 -- Assuming 0 means active/sick
            AND Health_Status.status = "Sick" -- Ensure the animal's health status is "Sick"
          ORDER BY Disease_Animal_Header.dateCreated DESC;
          `);
        if (data?.values.length) {
          //setTotalSick(data?.values[0].tsick)
          console.log("sickk", data?.values[0].tsick);
        } 
      });
    } catch (error) {
      console.log("Error loading grouped disease data: ", (error as Error).message); // More detailed error logging
      //setParentsData([]);
    }
  }

  const LoadEstrus = () =>{
    try {
      performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        const data = await db?.query(`
            SELECT COUNT(*) AS testrus FROM Estrus_Head WHERE status = 'On Going'
          `);
        if (data?.values.length) {
          setTotalEstrus(data?.values[0].testrus)
          console.log(data?.values[0].testrus);
        } 
      });
    } catch (error) {
      console.log("Error loading grouped disease data: ", (error as Error).message); // More detailed error logging
      //setParentsData([]);
    }
  }
   
  const updateAnimalProfile = (animal_id: number, DataTransfer: string, kind: number): any   => {

    if(kind === 1){
        try{
            performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
                const data = await db?.query(`
                        UPDATE Animal Set name = ?
                        WHERE id = ?
                    `, [DataTransfer, animal_id]);

                    if(data){
                      
                      const data = await db?.query(`SELECT Animal.id, 
                        Animal.breed_id, Breed.breed, 
                        Animal.gender, Animal.birthdate, 
                        Animal.health_status_id, 
                        Health_Status.status AS Health_Status, 
                        pregnancy_status, Animal.name,
                        Animal_Type.type AS AnimalKind, 
                        animal_father_id AS Father, 
                        animal_mother_id As Mother
                        FROM Animal 
                        INNER JOIN Breed ON Breed.id = Animal.breed_id 
                        INNER JOIN Health_Status ON Health_Status.id = Animal.health_status_id
                        INNER JOIN Animal_Type ON Breed.Animal_Type_id = Animal_Type.id
                        WHERE Animal.id = ?`, [animal_id]);
                          
                        if (data?.values.length) {
                          setAnimalData(data.values);
                        } else {
                          
                          setAnimalData([]); // Clear data if none found
                        }

                        const query = `
                        SELECT 
              
                       Animal.id AS AnimalId, 
                       Animal.name AS AnimalName, 
                       Animal.gender, 
                       Animal.birthdate, 
                       Animal.pregnancy_status, 
                       Animal_Type.type AS AnimalType, 
                       Breed.breed AS BreedName, 
                       Health_Status.status AS HealthStatus,
                       Feeds.feeds AS FeedName,
                       Feed_Animal_Details_Feeds.feeds_remarks AS FeedRemarks,
                       Vaccine_Supplement.Vaccine_Supplement AS SupplementName,
                       Feed_Animal_Details_Supplement.Supplement_Remarks AS SupplementRemarks,
                       Disease.disease AS DiseaseName,
                       Disease_Animal_Detail.remarks AS DiseaseRemarks,
                       Disease_Animal_Header.dateCreated AS DiseaseDateCreated,
                       Disease_Animal_Header.dateCured AS DiseaseDateCured,
                       MotherAnimal.name AS MotherName,
                       FatherAnimal.name AS FatherName,
                       Birth_Pregnanc_Head.id AS BirthRecordId,
                       Birth_Pregnanc_Head.OffspringNum AS OffspringCount,
                       Birth_Pregnanc_Head.AliveNum AS AliveCount,
                       Birth_Pregnanc_Head.DeadNum AS DeadCount,
                       Birth_Pregnanc_Head.SexMnum AS MaleCount,
                       Birth_Pregnanc_Head.SexFNum AS FemaleCount
                     FROM Animal
                     LEFT JOIN Breed ON Breed.id = Animal.breed_id
                     LEFT JOIN Animal_Type ON Animal_Type.id = Breed.Animal_Type_id
                     LEFT JOIN Health_Status ON Health_Status.id = Animal.health_status_id
                     LEFT JOIN Feed_Animal_Header ON Feed_Animal_Header.animal_id = Animal.id
                     LEFT JOIN Feed_Animal_Details_Feeds ON Feed_Animal_Details_Feeds.Feed_Animal_Header = Feed_Animal_Header.id
                     LEFT JOIN Feeds ON Feeds.id = Feed_Animal_Details_Feeds.feeds_id
                     LEFT JOIN Feed_Animal_Details_Supplement ON Feed_Animal_Details_Supplement.Feed_Animal_Header = Feed_Animal_Header.id
                     LEFT JOIN Vaccine_Supplement ON Vaccine_Supplement.id = Feed_Animal_Details_Supplement.Vaccine_Supplement_id
                     LEFT JOIN Disease_Animal_Header ON Disease_Animal_Header.animal_id = Animal.id
                     LEFT JOIN Disease_Animal_Detail ON Disease_Animal_Detail.disease_animal_header_id = Disease_Animal_Header.id
                     LEFT JOIN Disease ON Disease.id = Disease_Animal_Detail.disease_id
                     LEFT JOIN Estrus_Head ON Estrus_Head.animal_id = Animal.id
                     LEFT JOIN Estrus_Details ON Estrus_Details.Estrus_Head = Estrus_Head.id
                     LEFT JOIN Pregnancy ON Pregnancy.estrus_details_id = Estrus_Details.id
                     LEFT JOIN Birth_Pregnanc_Head ON Birth_Pregnanc_Head.pregnancy_id = Pregnancy.id
                     LEFT JOIN Animal AS MotherAnimal ON MotherAnimal.id = Estrus_Head.animal_id
                     LEFT JOIN Animal AS FatherAnimal ON FatherAnimal.id = Estrus_Details.animal_id_male
                     WHERE Animal.id = ?
                     `;
               
                     const result = await db?.query(query, [animal_id]);
                     
               
                     if (result?.values.length) {
                       setAnimalDetailedData(result.values); // Assuming you set the state with this function
                      
                     } else {
                       
                       setAnimalDetailedData([]);
                     }
                      presentAlert({
                        header: "Success", 
                        buttons: ['OK']
                      });

                      await db?.execute('COMMIT');
                    }else{
                      presentAlert({
                        header: "Error", 
                        buttons: ['OK']
                      });
                    }
            })
           }catch(error){
            presentAlert({
              header: "Error", 
              buttons: ['OK']
            });
           }
    }else if(kind === 2){
      try{
        performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
            const data = await db?.query(`
                    UPDATE Animal Set birthdate = ?
                    WHERE id = ?
                `, [DataTransfer, animal_id]);

                if(data){
                  
                  const data = await db?.query(`SELECT Animal.id, 
                    Animal.breed_id, Breed.breed, 
                    Animal.gender, Animal.birthdate, 
                    Animal.health_status_id, 
                    Health_Status.status AS Health_Status, 
                    pregnancy_status, Animal.name,
                    Animal_Type.type AS AnimalKind, 
                    animal_father_id AS Father, 
                    animal_mother_id As Mother
                    FROM Animal 
                    INNER JOIN Breed ON Breed.id = Animal.breed_id 
                    INNER JOIN Health_Status ON Health_Status.id = Animal.health_status_id
                    INNER JOIN Animal_Type ON Breed.Animal_Type_id = Animal_Type.id
                    WHERE Animal.id = ?`, [animal_id]);
                      
                    if (data?.values.length) {
                      setAnimalData(data.values);
                    } else {
                      
                      setAnimalData([]); // Clear data if none found
                    }

                    const query = `
                    SELECT 
          
                   Animal.id AS AnimalId, 
                   Animal.name AS AnimalName, 
                   Animal.gender, 
                   Animal.birthdate, 
                   Animal.pregnancy_status, 
                   Animal_Type.type AS AnimalType, 
                   Breed.breed AS BreedName, 
                   Health_Status.status AS HealthStatus,
                   Feeds.feeds AS FeedName,
                   Feed_Animal_Details_Feeds.feeds_remarks AS FeedRemarks,
                   Vaccine_Supplement.Vaccine_Supplement AS SupplementName,
                   Feed_Animal_Details_Supplement.Supplement_Remarks AS SupplementRemarks,
                   Disease.disease AS DiseaseName,
                   Disease_Animal_Detail.remarks AS DiseaseRemarks,
                   Disease_Animal_Header.dateCreated AS DiseaseDateCreated,
                   Disease_Animal_Header.dateCured AS DiseaseDateCured,
                   MotherAnimal.name AS MotherName,
                   FatherAnimal.name AS FatherName,
                   Birth_Pregnanc_Head.id AS BirthRecordId,
                   Birth_Pregnanc_Head.OffspringNum AS OffspringCount,
                   Birth_Pregnanc_Head.AliveNum AS AliveCount,
                   Birth_Pregnanc_Head.DeadNum AS DeadCount,
                   Birth_Pregnanc_Head.SexMnum AS MaleCount,
                   Birth_Pregnanc_Head.SexFNum AS FemaleCount
                 FROM Animal
                 LEFT JOIN Breed ON Breed.id = Animal.breed_id
                 LEFT JOIN Animal_Type ON Animal_Type.id = Breed.Animal_Type_id
                 LEFT JOIN Health_Status ON Health_Status.id = Animal.health_status_id
                 LEFT JOIN Feed_Animal_Header ON Feed_Animal_Header.animal_id = Animal.id
                 LEFT JOIN Feed_Animal_Details_Feeds ON Feed_Animal_Details_Feeds.Feed_Animal_Header = Feed_Animal_Header.id
                 LEFT JOIN Feeds ON Feeds.id = Feed_Animal_Details_Feeds.feeds_id
                 LEFT JOIN Feed_Animal_Details_Supplement ON Feed_Animal_Details_Supplement.Feed_Animal_Header = Feed_Animal_Header.id
                 LEFT JOIN Vaccine_Supplement ON Vaccine_Supplement.id = Feed_Animal_Details_Supplement.Vaccine_Supplement_id
                 LEFT JOIN Disease_Animal_Header ON Disease_Animal_Header.animal_id = Animal.id
                 LEFT JOIN Disease_Animal_Detail ON Disease_Animal_Detail.disease_animal_header_id = Disease_Animal_Header.id
                 LEFT JOIN Disease ON Disease.id = Disease_Animal_Detail.disease_id
                 LEFT JOIN Estrus_Head ON Estrus_Head.animal_id = Animal.id
                 LEFT JOIN Estrus_Details ON Estrus_Details.Estrus_Head = Estrus_Head.id
                 LEFT JOIN Pregnancy ON Pregnancy.estrus_details_id = Estrus_Details.id
                 LEFT JOIN Birth_Pregnanc_Head ON Birth_Pregnanc_Head.pregnancy_id = Pregnancy.id
                 LEFT JOIN Animal AS MotherAnimal ON MotherAnimal.id = Estrus_Head.animal_id
                 LEFT JOIN Animal AS FatherAnimal ON FatherAnimal.id = Estrus_Details.animal_id_male
                 WHERE Animal.id = ?
                 `;
           
                 const result = await db?.query(query, [animal_id]);
                 
           
                 if (result?.values.length) {
                   setAnimalDetailedData(result.values); // Assuming you set the state with this function
                  
                 } else {
                   
                   setAnimalDetailedData([]);
                 }
                  presentAlert({
                    header: "Success", 
                    buttons: ['OK']
                  });

                  await db?.execute('COMMIT');
                }else{
                  presentAlert({
                    header: "Error", 
                    buttons: ['OK']
                  });
                }
        })
       }catch(error){
        presentAlert({
          header: "Error", 
          buttons: ['OK']
        });
       }
    }

   // return feedback;
    
};

const UpdateFeeds = (remarks:string, id:number, an_id:number) =>{
  try{
      performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
          const data = await db?.query(`
                 UPDATE Feed_Animal_Details_Feeds SET  feeds_remarks = ? WHERE id = ?
              `, [remarks, id]);
         if(data){
             
              const data = await db?.query(`SELECT Animal.id, FAH.id, F.feeds,
                FAD.feeds_remarks as remarks, FAD.feeds_id, FAD.status, FAD.dateCreated
                FROM Animal 
                INNER JOIN Feed_Animal_Header AS FAH ON FAH.id = Animal.id
                INNER JOIN Feed_Animal_Details_Feeds AS FAD ON FAD.Feed_Animal_Header = FAH.id
                INNER JOIN Feeds as F ON F.id = FAD.feeds_id
                WHERE Animal.id = ?`, [an_id]);
            
              if (data?.values.length) {
                setFeedsData(data.values);
                presentAlert({
                  header: "Success", 
                  buttons: ['OK']
                });
              } else {
                
                setFeedsData([]); 
                presentAlert({
                  header: "Error", 
                  buttons: ['OK']
                });
              }
          await db?.execute('COMMIT');
          
         }
      })
  }catch(error){
      console.log((error as Error).message)
  }
}

  const closeSheet = () => {
    setIsOpen(false);
    setAnimalData([]); // Clear animal data on close
    setScannedId(""); // Reset scanned ID
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "NO DATA";
    }
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const qrCodePlugin = useMemo(() => (
    <Html5QrcodePlugin 
      fps={10}
      qrbox={250}
      disableFlip={false}
      qrCodeSuccessCallback={onNewScanResult}
    />
   
  ), []);

  return (
    <>
      <SideBar />
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        <IonContent className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={refreshtThePage}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonRow>
            <IonCol  className="ion-text-center"><h1><strong>Livestock Reports</strong></h1></IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonCard  id='TotalLiveStockDetailed'>
                <IonCardHeader className="ion-text-center">
                  <IonCardTitle>{TotalLiveStock}</IonCardTitle>
                  <IonCardSubtitle>Total Livestocks</IonCardSubtitle>
                </IonCardHeader>
              </IonCard>
            </IonCol>
            <IonCol>
              <IonCard id="TotalPregnancyDetailed">
                <IonCardHeader className="ion-text-center">
                  <IonCardTitle>{TotalPregy}</IonCardTitle>
                  <IonCardSubtitle>Total Pregnant</IonCardSubtitle>
                </IonCardHeader>
              </IonCard>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonCard id="TotalSickDetailed">
                <IonCardHeader className="ion-text-center">
                  <IonCardTitle>{TotalSick}</IonCardTitle>
                  <IonCardSubtitle>Total Sick</IonCardSubtitle>
                </IonCardHeader>
              </IonCard>
            </IonCol>
            <IonCol>
              <IonCard id="TotalEstrusDetailed">
                <IonCardHeader className="ion-text-center">
                  <IonCardTitle>{TotalEstrus}</IonCardTitle>
                  <IonCardSubtitle>Total Estrus</IonCardSubtitle>
                </IonCardHeader>
              </IonCard>
            </IonCol>
          </IonRow>
            <IonRow>
              <IonCol>
               {qrCodePlugin}
              </IonCol>
            </IonRow>
            <div>
             
                <IonModal trigger='TotalLiveStockDetailed' ref={modal} initialBreakpoint={0.7} breakpoints={[0, 1]}>
                    <IonContent className="ion-padding">
                        <IonRow >
                          <IonCol className="ion-text-center">
                            <h1>Total Livestocks</h1>
                          </IonCol>
                        </IonRow>
                        {TotalLiveStockDetailed?.map((tl)=>(
                          <IonCard key={`LiveStockDetailed ${tl.AnimalID}`}>
                            <IonCardContent>
                              <IonItem>
                                <IonLabel position="fixed">Animal ID</IonLabel>
                                <IonInput value={tl.AnimalID} readonly />
                              </IonItem>

                              <IonItem>
                                <IonLabel position="fixed">Animal Name</IonLabel>
                                <IonInput value={tl.AnimalName} readonly />
                              </IonItem>

                               <IonItem>
                                <IonLabel position="fixed">Animal Gender</IonLabel>
                                <IonInput value={tl.AnimalGender} readonly />
                              </IonItem>

                              <IonItem>
                                <IonLabel position="fixed">Mother</IonLabel>
                                <IonInput value={tl.Mother} readonly />
                              </IonItem>

                              <IonItem>
                                <IonLabel position="fixed">Father</IonLabel>
                                <IonInput value={tl.Father} readonly />
                              </IonItem>

                              <IonItem>
                                <IonLabel position="fixed">Animal</IonLabel>
                                <IonInput value={tl.AnimalType} readonly />
                              </IonItem>

                              <IonItem>
                                <IonLabel position="fixed">Breed</IonLabel>
                                <IonInput value={tl.AnimalBreed} readonly />
                              </IonItem>

                              <IonItem>
                                <IonLabel position="fixed">Animal Birthday</IonLabel>
                                <IonInput value={formatDate(tl.AnimalBday)} readonly />
                              </IonItem>

                              <IonItem>
                                <IonLabel position="fixed">Health Status</IonLabel>
                                <IonInput value={tl.HealthStatus} readonly />
                              </IonItem>

                              <IonItem>
                                <IonLabel position="fixed">Pregnancy Status</IonLabel>
                                <IonInput value={tl.PregnancyStatus} readonly />
                              </IonItem>

                            </IonCardContent>
                          </IonCard>
                        ))}
                        <IonButton expand="block" onClick={handleExportTotalLivestock}>Export</IonButton>
                    </IonContent>
                </IonModal>

                <IonModal trigger='TotalPregnancyDetailed' ref={modal} initialBreakpoint={0.7} breakpoints={[0, 1]}>
                    <IonContent className="ion-padding">
                        <IonRow >
                          <IonCol className="ion-text-center">
                            <h1>Pregnancy Detailed Info</h1>
                          </IonCol>
                        </IonRow>
                        {TotalPregnancyDetailed?.map((tl) => (
                        tl.DateOnHeat === null ? null : (
                          <IonCard key={`LiveStockDetailed ${tl.AnimalID}`}>
                            <IonCardContent>
                            
                              <IonItem>
                                <IonLabel position="fixed">Animal ID</IonLabel>
                                <IonInput value={tl.AnimalID} readonly />
                              </IonItem>

                              <IonItem>
                                <IonLabel position="fixed">Animal Name</IonLabel>
                                <IonInput value={tl.AnimalName} readonly />
                              </IonItem>

                              <IonItem>
                                <IonLabel position="fixed">Breed</IonLabel>
                                <IonInput value={tl.AnimalBreed} readonly />
                              </IonItem>

                              <IonItem>
                                <IonLabel position="fixed">Pregnancy Status</IonLabel>
                                <IonInput value={tl.PregnancyStatus} readonly />
                              </IonItem>

                              <IonItem>
                                <IonLabel position="fixed">Estrus Date</IonLabel>
                                <IonInput
                                  value={formatDate(tl.DateOnHeat) === 'January 01, 1970' ? '' : formatDate(tl.DateOnHeat)}
                                  readonly
                                />
                              </IonItem>

                              <IonItem>
                                <IonLabel position="fixed">Estrus Status</IonLabel>
                                <IonInput value={tl.EstrusStatus} readonly />
                              </IonItem>

                              <IonItem>
                                <IonLabel position="fixed">Breeder</IonLabel>
                                <IonInput value={tl.Breeder} readonly />
                              </IonItem>

                              <IonItem>
                                <IonLabel position="fixed">Breeding Type</IonLabel>
                                <IonInput value={tl.BreedingType} readonly />
                              </IonItem>

                              <IonItem>
                                <IonLabel position="fixed">Pregnancy Date</IonLabel>
                                <IonInput
                                  value={formatDate(tl.PregnancyDateConfirmed) === 'January 01, 1970' ? '' : formatDate(tl.PregnancyDateConfirmed)}
                                  readonly
                                />
                              </IonItem>

                              <IonItem>
                                <IonLabel position="fixed">Given Birth</IonLabel>
                                <IonInput
                                  value={formatDate(tl.GivenBirth) === 'January 01, 1970' ? '' : formatDate(tl.GivenBirth)}
                                  readonly
                                />
                              </IonItem>

                              <IonItem>
                                <IonLabel position="fixed">Total Offspring</IonLabel>
                                <IonInput value={tl.TotalOffspring} readonly />
                              </IonItem>
                            </IonCardContent>
                          </IonCard>
                        )
                      ))}
                        <IonButton expand="block" onClick={handleExportTotalPregnancy}>Export</IonButton>
                    </IonContent>
                </IonModal>

                <IonModal trigger='TotalEstrusDetailed' ref={modal} initialBreakpoint={0.7} breakpoints={[0, 1]}>
                    <IonContent className="ion-padding">
                        <IonRow >
                          <IonCol className="ion-text-center">
                            <h1>Estrus Detailed Info</h1>
                          </IonCol>
                        </IonRow>
                        {TotalPregnancyDetailed?.map((tl) => (
                        tl.DateOnHeat === null ? null : (
                          <IonCard key={`LiveStockDetailed ${tl.AnimalID}`}>
                            <IonCardContent>
                            
                              <IonItem>
                                <IonLabel position="fixed">Animal ID</IonLabel>
                                <IonInput value={tl.AnimalID} readonly />
                              </IonItem>

                              <IonItem>
                                <IonLabel position="fixed">Animal Name</IonLabel>
                                <IonInput value={tl.AnimalName} readonly />
                              </IonItem>

                              <IonItem>
                                <IonLabel position="fixed">Breed</IonLabel>
                                <IonInput value={tl.AnimalBreed} readonly />
                              </IonItem>

                              <IonItem>
                                <IonLabel position="fixed">Pregnancy Status</IonLabel>
                                <IonInput value={tl.PregnancyStatus} readonly />
                              </IonItem>

                              <IonItem>
                                <IonLabel position="fixed">Estrus Date</IonLabel>
                                <IonInput
                                  value={formatDate(tl.DateOnHeat) === 'January 01, 1970' ? '' : formatDate(tl.DateOnHeat)}
                                  readonly
                                />
                              </IonItem>

                              <IonItem>
                                <IonLabel position="fixed">Estrus Status</IonLabel>
                                <IonInput value={tl.EstrusStatus} readonly />
                              </IonItem>

                              <IonItem>
                                <IonLabel position="fixed">Breeder</IonLabel>
                                <IonInput value={tl.Breeder} readonly />
                              </IonItem>

                              <IonItem>
                                <IonLabel position="fixed">Breeding Type</IonLabel>
                                <IonInput value={tl.BreedingType} readonly />
                              </IonItem>

                              <IonItem>
                                <IonLabel position="fixed">Pregnancy Date</IonLabel>
                                <IonInput
                                  value={formatDate(tl.PregnancyDateConfirmed) === 'January 01, 1970' ? '' : formatDate(tl.PregnancyDateConfirmed)}
                                  readonly
                                />
                              </IonItem>

                              <IonItem>
                                <IonLabel position="fixed">Given Birth</IonLabel>
                                <IonInput
                                  value={formatDate(tl.GivenBirth) === 'January 01, 1970' ? '' : formatDate(tl.GivenBirth)}
                                  readonly
                                />
                              </IonItem>

                              <IonItem>
                                <IonLabel position="fixed">Total Offspring</IonLabel>
                                <IonInput value={tl.TotalOffspring} readonly />
                              </IonItem>
                            </IonCardContent>
                          </IonCard>
                        )
                      ))}

                        <IonButton expand="block" onClick={handleExportTotalPregnancy}>Export</IonButton>
                    </IonContent>
                </IonModal>

                <IonModal trigger='TotalSickDetailed' ref={modal} initialBreakpoint={0.7} breakpoints={[0, 1]}>
                    <IonContent className="ion-padding">
                        <IonRow >
                          <IonCol className="ion-text-center">
                            <h1>Animal Sick Detailed Info</h1>
                          </IonCol>
                        </IonRow>
                        {TotalSickDetailed?.map((tl)=>(
                   
                          <IonCard key={`LiveStockDetailed ${tl.AnimalID}`}>
                            <IonCardContent>
                              <IonItem>
                                <IonLabel position="fixed">Animal ID</IonLabel>
                                <IonInput value={tl.AnimalID} readonly />
                              </IonItem>

                              <IonItem>
                                <IonLabel position="fixed">Animal Name</IonLabel>
                                <IonInput value={tl.AnimalName} readonly />
                              </IonItem>
                             
                              <IonItem>
                                <IonLabel position="fixed">Breed</IonLabel>
                                <IonInput value={tl.AnimalBreed} readonly />
                              </IonItem>

                              <IonItem>
                                <IonLabel position="fixed">Health Status</IonLabel>
                                <IonInput value={tl.HealthStatus} readonly />
                              </IonItem>

                              <IonItem>
                                <IonLabel position="fixed">Sick Status</IonLabel>
                                <IonInput value={tl.SickStatus} readonly />
                              </IonItem>

                              <IonItem>
                                <IonLabel position="fixed">Disease</IonLabel>
                                <IonInput value={tl.Disease} readonly />
                              </IonItem>

                              <IonItem>
                                <IonLabel position="fixed">Date Noticed</IonLabel>
                                <IonInput value={formatDate(tl.DateNoticed) === 'January 01, 1970' ? '' : formatDate(tl.DateNoticed)} readonly />
                              </IonItem>

                              <IonItem>
                                <IonLabel position="fixed">Date Cured</IonLabel>
                                <IonInput value={tl.DateCured} readonly />
                              </IonItem>

                              <IonItem>
                                <IonLabel position="fixed">Vaccine</IonLabel>
                                <IonInput value={tl.Vaccine_Supplement} readonly />
                              </IonItem>

                              <IonItem>
                                <IonLabel position="fixed">Remarks</IonLabel>
                                <IonInput value={tl.VaccineRemarks} readonly />
                              </IonItem>

                              <IonItem>
                                <IonLabel position="fixed">Veteranary</IonLabel>
                                <IonInput value={tl.Vet} readonly />
                              </IonItem>

                              <IonItem>
                                <IonLabel position="fixed">Status</IonLabel>
                                <IonInput value={tl.status} readonly />
                              </IonItem>
                             
                            </IonCardContent>
                          </IonCard>
                        ))}
                        <IonButton expand="block" onClick={handleExportTotalSick}>Export</IonButton>
                    </IonContent>
                </IonModal>
              
            </div>
         
          <div>
            
            {scannedID !== "" && animalData.length > 0 ? (
              <IonModal isOpen={isOpen} ref={modal} initialBreakpoint={0.7} breakpoints={[0, 1]}>
                <IonContent className="ion-padding">
                  {animalData.map((a) => (
                    <React.Fragment key={a.id}> {/* Fragment with key */}
                      <IonRow>
                        <IonCol className="ion-text-center">
                          <h2>{a.name}</h2> 
                        </IonCol>
                      </IonRow>
                      
                      <IonItem lines="none">
                        <IonLabel className="ion-text-wrap"><h2><strong>Animal Identification</strong></h2></IonLabel>
                      </IonItem>

                      <IonItem>
                        <IonLabel position="stacked">Animal ID:</IonLabel>
                        <IonInput value={a.id} readonly />
                      </IonItem>
                      
                      <IonItem id={`Animal_${a.name}`}>
                        <IonLabel position="stacked">Name:</IonLabel>
                        <IonInput value={a.name} readonly />
                      </IonItem>
                      
                      <IonAlert
                          trigger={`Animal_${a.name}`} // Ensuring unique trigger
                          header="Edit Name"
                          inputs={[
                            {
                              placeholder: 'Name',
                              name: "name",
                              value: alertData?.name || a.name // Ensure updated value is reflected
                            }
                          ]}
                          buttons={[
                            {
                              text: 'Cancel',
                              role: 'cancel'
                            },
                            {
                              text: 'Save',
                              role: 'confirm',
                              handler: (data) => { // 'data' contains input values
                                if (data.name) {
                                  updateAnimalProfile(a.id, data.name, 1);
                                }
                              }
                            }
                          ]}
                          onDidDismiss={(event) => {
                            if (event.detail?.data) {
                              setAlertData(event.detail.data); // Updates state when dismissed
                            }
                          }}
                        />
                      
                      <IonItem>
                        <IonLabel position="stacked">Breed:</IonLabel>
                        <IonInput value={a.breed} readonly />
                      </IonItem>
                      
                      <IonItem>
                        <IonLabel position="stacked">Animal:</IonLabel>
                        <IonInput value={a.AnimalKind} readonly />
                      </IonItem>
                      
                      <IonItem>
                        <IonLabel position="stacked">Gender:</IonLabel>
                        <IonInput value={a.gender} readonly />
                      </IonItem>
                      
                      <IonItem>
                        <IonLabel position="stacked">Birthdate:</IonLabel>
                        <IonInput id={`Bday_${a.birthdate}`} value={formatDate(a.birthdate)} readonly />
                      </IonItem>

                      <IonAlert
                          trigger={`Bday_${a.birthdate}`} // Ensuring unique trigger
                          header="Edit Birtday"
                          inputs={[
                            {
                              type: 'date',
                              placeholder: 'Birthday',
                              name: "bday",
                              value: alertData?.bday || a.birthdate // Ensure updated value is reflected
                            }
                          ]}
                          buttons={[
                            {
                              text: 'Cancel',
                              role: 'cancel'
                            },
                            {
                              text: 'Save',
                              role: 'confirm',
                              handler: (data) => { // 'data' contains input values
                                if (data.bday) {
                                  updateAnimalProfile(a.id, data.bday, 2);
                                }
                              }
                            }
                          ]}
                          onDidDismiss={(event) => {
                            if (event.detail?.data) {
                              setAlertData(event.detail.data); // Updates state when dismissed
                            }
                          }}
                        />

                      <IonItem lines="none">
                        <IonLabel className="ion-text-wrap"><h2><strong>Lineage Information</strong></h2></IonLabel>
                      </IonItem>

                      {ParentsData?.map((p)=>(
                        <>
                         <IonItem>
                          <IonLabel position="stacked">Sire (Father):</IonLabel>
                          <IonInput value={p.Father} readonly />
                        </IonItem>
                        
                        <IonItem>
                          <IonLabel position="stacked">Dam (Mother):</IonLabel>
                          <IonInput value={p.Mother} readonly />
                        </IonItem>
                        </>
                      ))}
                     

                      <IonItem lines="none">
                        <IonLabel className="ion-text-wrap"><h2><strong>Health Status</strong></h2></IonLabel>
                      </IonItem>

                      <IonItem>
                        <IonLabel position="stacked">Health Status:</IonLabel>
                        <IonInput value={a.Health_Status} readonly />
                      </IonItem>

                      {FeedsData?.map((fd) => (
                        <React.Fragment key={fd.id} >
                          <IonCard className="ion-margin-top" id={`Feed_${fd.id}`}>
                            <IonCardContent>
                            <IonItem lines="none">
                            <IonLabel className="ion-text-wrap"><h2><strong>Feed & Nutrition Information</strong></h2></IonLabel>
                          </IonItem>
                          
                          <IonItem>
                            <IonLabel position="stacked">Feed Type:</IonLabel>
                            <IonInput value={fd.feeds} readonly />
                          </IonItem>

                          <IonItem>
                            <IonLabel position="stacked">Remarks:</IonLabel>
                            <IonInput value={fd.remarks} readonly />
                          </IonItem>

                          <IonItem>
                            <IonLabel position="stacked">Status:</IonLabel>
                            <IonInput value={fd.status === 0 ? 'On Going' : 'Done'} readonly />
                          </IonItem>

                          <IonItem>
                            <IonLabel position="stacked">Date Given:</IonLabel>
                            <IonInput value={formatDate(fd.dateCreated)} readonly />
                          </IonItem>
                            </IonCardContent>
                          </IonCard>

                          <IonAlert
                          trigger={`Feed_${fd.id}`} 
                          header="Edit Feeding Information"
                          inputs={[
                            {
                              type: 'text',
                              placeholder: 'Remarks',
                              name: "rmarks",
                              value: alertData?.rmarks || fd.remarks 
                            }
                          ]}
                          buttons={[
                            {
                              text: 'Cancel',
                              role: 'cancel'
                            },
                            {
                              text: 'Save',
                              role: 'confirm',
                              handler: (data) => { // 'data' contains input values
                                if (data.rmarks) {
                                  UpdateFeeds(data.rmarks, fd.feeds_id, fd.id);
                                }
                              }
                            }
                          ]}
                          onDidDismiss={(event) => {
                            if (event.detail?.data) {
                              setAlertData(event.detail.data); // Updates state when dismissed
                            }
                          }}
                        />
                          
                        </React.Fragment>

                        
                      ))}

                      {SupplementData?.map((sd) => (
                        <IonCard key={sd.id} className="ion-margin-top">

                          <IonCardContent>
                            <IonItem>
                              <IonLabel position="stacked">Supplement Type:</IonLabel>
                              <IonInput value={sd.supplement} readonly />
                            </IonItem>

                            <IonItem>
                              <IonLabel position="stacked">Remarks:</IonLabel>
                              <IonInput value={sd.remarks} readonly />
                            </IonItem>

                            <IonItem>
                              <IonLabel position="stacked">Status:</IonLabel>
                              <IonInput value={sd.status === 0 ? 'On Going' : 'Done'} readonly />
                            </IonItem>

                            <IonItem>
                              <IonLabel position="stacked">Date Given:</IonLabel>
                              <IonInput value={formatDate(sd.dateCreated)} readonly />
                            </IonItem>
                          </IonCardContent>
                        </IonCard>
                      ))}
                      <IonItem lines="none">
                        <IonLabel className="ion-text-wrap"><h2><strong>Disease History</strong></h2></IonLabel>
                      </IonItem>

                      {DiseaseData?.map((dd) => (
                        <React.Fragment key={dd.id}>
                          <IonCard>
                            <IonCardContent>
                            <IonItem>
                            <IonLabel position="stacked">Disease Name:</IonLabel>
                            <IonInput value={dd.disease} readonly />
                          </IonItem>

                          <IonItem>
                            <IonLabel position="stacked">Diagnosis Date:</IonLabel>
                            <IonInput value={formatDate(dd.firstDateCreated)} readonly />
                          </IonItem>

                          <IonItem>
                            <IonLabel position="stacked">Status:</IonLabel>
                            <IonInput value={dd.status === 0 ? 'Sick' : 'Recovered'} readonly />
                          </IonItem>

                          <IonItem>
                            <IonLabel position="stacked">Date Recovered:</IonLabel>
                            <IonInput value={formatDate(dd.lastDateCured)} readonly />
                          </IonItem>

                          <IonItem>
                            <IonLabel position="stacked">Treatment Details:</IonLabel>
                            <IonInput value={dd.vaccines} readonly />
                          </IonItem>
                            </IonCardContent>
                          </IonCard>
                          
                        </React.Fragment>
                      ))}

                      {BreedHistory?.map((bm)=>(
                        <div className="ion-margin-top">
                        
                        <IonCard>
                            <IonCardContent>

                            <IonItem lines="none">
                              <IonLabel className="ion-text-wrap"><h2><strong>Breeding History</strong></h2></IonLabel>
                            </IonItem>

                              <IonItem>
                                <IonLabel position="stacked">Parity:</IonLabel>
                                <IonInput value={bm.Parity} readonly />
                              </IonItem>
                              <IonItem>
                                <IonLabel position="stacked">Total Alive:</IonLabel>
                                <IonInput value={bm.TotalAlive} readonly />
                              </IonItem>
                              <IonItem>
                                <IonLabel position="stacked">Total Dead:</IonLabel>
                                <IonInput value={bm.TotalDead} readonly />
                              </IonItem>
                              <IonItem>
                                <IonLabel position="stacked">Total Male:</IonLabel>
                                <IonInput value={bm.TotalMale} readonly />
                              </IonItem>
                              <IonItem>
                                <IonLabel position="stacked">Total Female:</IonLabel>
                                <IonInput value={bm.TotalFemale} readonly />
                              </IonItem>
                            </IonCardContent>
                        </IonCard>
                        </div>
                        
                      ))}

                      {BreedDetails?.map((bd)=>(
                          <IonCard>
                            <IonCardContent>
                            <IonItem>
                                <IonLabel className="ion-text-wrap"><h2><strong>Breeding Detailed</strong></h2></IonLabel>
                              </IonItem>

                              <IonItem>
                                <IonLabel position="stacked">Estrus Date:</IonLabel>
                                <IonInput value={formatDate(bd.OnHeat) === 'January 01, 1970' ? '' : formatDate(bd.OnHeat)} readonly />
                              </IonItem>
                              <IonItem>
                                <IonLabel position="stacked">Estrus Status</IonLabel>
                                <IonInput value={bd.EH_Status} readonly />
                              </IonItem>
                              <IonItem>
                                <IonLabel position="stacked">Breeder</IonLabel>
                                <IonInput value={`${bd.fname} ${bd.lname}`} readonly />
                              </IonItem>
                              <IonItem>
                                <IonLabel position="stacked">Father's Name</IonLabel>
                                <IonInput value={bd.Male} readonly />
                              </IonItem>
                              <IonItem>
                                <IonLabel position="stacked">Breed Status</IonLabel>
                                <IonInput value={bd.EDStatus} readonly />
                              </IonItem>
                              <IonItem>
                                <IonLabel position="stacked">Pregnancy Confirm</IonLabel>
                                <IonInput value={bd.EDStatus} readonly />
                              </IonItem>
                              <IonItem>
                                <IonLabel position="stacked">{bd.EDStatus === 'Success' ? "Date Pregnancy Confirm" : 'Date Failed'}</IonLabel>
                                <IonInput value={bd.EDStatus==='Success' ? formatDate(bd.dateConfirmed):formatDate(bd.dateFailed)} readonly />
                              </IonItem>
                              <IonItem>
                                <IonLabel position="stacked">{bd.EDStatus === 'Success' ? "Total Offspring" : ''}</IonLabel>
                                <IonInput value={bd.EDStatus==='Success' ? bd.OffspringNum : ''} readonly />
                              </IonItem>
                              <IonItem>
                                <IonLabel position="stacked">{bd.EDStatus === 'Success' ? "Total Alive" : ''}</IonLabel>
                                <IonInput value={bd.EDStatus==='Success' ? bd.AliveNum : ''} readonly />
                              </IonItem>
                              <IonItem>
                                <IonLabel position="stacked">{bd.EDStatus === 'Success' ? "Total M" : ''}</IonLabel>
                                <IonInput value={bd.EDStatus==='Success' ? bd.SexMnum : ''} readonly />
                              </IonItem>
                              <IonItem>
                                <IonLabel position="stacked">{bd.EDStatus === 'Success' ? "Total F" : ''}</IonLabel>
                                <IonInput value={bd.EDStatus==='Success' ? bd.SexFNum : ''} readonly />
                              </IonItem>
                            </IonCardContent>
                          </IonCard>
                      ))}
                     
                    </React.Fragment>
                  ))}
                  <IonButton className="ion-margin-top" expand="block" onClick={closeSheet}>Close</IonButton>
                  <IonButton className="ion-margin-top" expand="block" onClick={handleExport}>
      Export Data
    </IonButton>
                 
                </IonContent>
              </IonModal>
            ) : null}
          </div>
        </IonContent>
        <IonFooter className="ion-text-center">
          <IonToolbar>
            <IonIcon 
              icon={barcodeOutline} 
              size="large" 
              id="Ohhh"
            />
          </IonToolbar>
        </IonFooter>
      </IonPage>
    </>
  );
};

export default Landing;
