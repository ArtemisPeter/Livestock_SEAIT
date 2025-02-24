import { IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonBadge, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonFab, IonFabButton, IonIcon, IonModal, IonInput, IonLabel, IonRow, IonCol, IonButton, IonAlert, useIonAlert } from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import SideBar from "./SideBar";
import { add } from "ionicons/icons";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import useSQLiteDB from "../composables/useSQLiteDB";
import { useHistory } from "react-router";

type SQLItem = {
    id: number;
    type: string;
    gestation_period: number
}

const AllAnimalMain: React.FC = () => {
    const [category, setCategory] = useState("");
    const [gestation, setGestation] = useState(0);
    const [DataCategory, setDataCategory] = useState<Array<SQLItem>>()
    const { performSQLAction, initialized } = useSQLiteDB();
    const [presentAlert] = useIonAlert();

    const history = useHistory();

    const proceedToAnimal =  (id:number) =>{
        history.push(`/specAnimal/${id}`)
    }
    

    useEffect(()=>{
        loadData();
    }, [initialized])

    const clearData = () => {
        setCategory("");
        setGestation(0);
    }

    const loadData = async () =>{
        try{
            performSQLAction(async(db:SQLiteDBConnection | undefined) => {
                const data = await db?.query(`SELECT * FROM Animal_Type`);
                console.log(data)
                setDataCategory(data?.values)
            })
        }catch(error){
            console.log((error as Error).message);
            setDataCategory([]);
        }
    }

   
    
  

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
            <IonTitle>Animals</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
            {DataCategory?.map((dbCat)=>(
                
                <IonCard key={dbCat?.id} id={dbCat?.type} onClick={()=>proceedToAnimal(dbCat?.id)}>
                    <IonCardHeader >
                        <IonCardTitle>
                                {dbCat.type}
                        </IonCardTitle>
                    </IonCardHeader>
                </IonCard>
            ))}
        </IonContent>
        
      </IonPage>
    </>

    );
}
export default AllAnimalMain