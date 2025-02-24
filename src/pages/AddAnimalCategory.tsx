import { IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonBadge, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonFab, IonFabButton, IonIcon, IonModal, IonInput, IonLabel, IonRow, IonCol, IonButton, IonAlert, useIonAlert } from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import SideBar from "./SideBar";
import { add } from "ionicons/icons";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import useSQLiteDB from "../composables/useSQLiteDB";

type SQLItem = {
    id: number;
    type: string;
    gestation_period: number
}

const AddAnimaCategory: React.FC = () => {
    const [category, setCategory] = useState("");
    const [gestation, setGestation] = useState(0);
    const [DataCategory, setDataCategory] = useState<Array<SQLItem>>()
    const { performSQLAction, initialized } = useSQLiteDB();
    const [presentAlert] = useIonAlert();
    

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

    const addCategory = async (category: string, gestation:number) => {
        try{
            performSQLAction(
                async(db: SQLiteDBConnection | undefined) => {

                    const duplicate = await db?.query(`SELECT * FROM Animal_Type WHERE type = ? AND gestation_period = ?`, [
                        category, gestation
                    ]);

                    if (duplicate && duplicate.values && duplicate.values.length > 0) {
                       presentAlert({
                        header: 'Duplicate!',
                        buttons: ['OK']
                       })
                    } else {
                        const insert = await db?.query(`INSERT OR IGNORE INTO Animal_Type (type, gestation_period) VALUES(?,?)`, [
                            category, gestation
                        ]);
                        presentAlert({
                            header: 'Success!',
                            buttons: ['OK']
                           });
                           clearData();
                           const data = await db?.query(`SELECT * FROM Animal_Type`);
                console.log(data)
                setDataCategory(data?.values)
                await db?.execute('COMMIT');
                    }
                }
            )
        }catch(error){
            console.log((error as Error).message);
            setCategory("");
            setGestation(0);
        }
    }

    const updateCategory = async (category: string, gestation: number, id:number)=>{
        try{
            performSQLAction(
                async(db: SQLiteDBConnection | undefined)=>{
                    const updateData = await db?.query(`UPDATE Animal_Type SET type = ?, gestation_period = ? WHERE id = ?`, [
                        category, gestation, id
                    ]);

                    presentAlert({
                        header: 'Success!',
                        buttons: ['OK']
                       });
                       const data = await db?.query(`SELECT * FROM Animal_Type`);
                       setDataCategory(data?.values)
                }
            )

          

        }catch(error){
            console.log((error as Error).message);
            setCategory("");
            setGestation(0);
        }
    }
    
    const doEditItem = (data: SQLItem | undefined)=>{
        if(data){
            setCategory(data.type);
            setGestation(data.gestation_period);
        }else{
            setCategory("");
            setGestation(0);
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
            <IonTitle>Add Animal Category</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
            {DataCategory?.map((dbCat)=>(
                
                <IonCard key={dbCat?.id} id={dbCat?.type} onClick={() => doEditItem(dbCat)}>
                    <IonCardHeader >
                        <IonCardTitle>
                                {dbCat.type}
                        </IonCardTitle>
                    </IonCardHeader>
                </IonCard>
            ))}

            {DataCategory?.map((dbCat)=>(
              
                <IonModal ref={modal} key={dbCat?.id} trigger={dbCat?.type} initialBreakpoint={0.7} breakpoints={[0, 1]}>

                <IonContent className="ion-padding">
                    <IonRow>
                        <IonCol className="ion-text-center">
                            <h2>Edit {dbCat.type}</h2>
                        </IonCol>
                       
                    </IonRow>
                    <IonRow>
                        <IonLabel className="ion-margin-top">Animal Type:</IonLabel>
                        <IonInput
                            onIonInput={(e)=>setCategory(e.target.value as string)}
                            value={category}
                        ></IonInput>
                    </IonRow>
                    <IonRow>
                        <IonLabel className="ion-margin-top">Gestation Period</IonLabel>
                        <IonInput
                            type="number"
                            onIonInput={(e)=>setGestation(e.target.value as number)}
                            value={gestation}
                        ></IonInput>
                    </IonRow>
                   
                    <IonButton expand="block" className="ion-margin-top" onClick={()=>updateCategory(category, gestation, dbCat.id)}>Update</IonButton>
                </IonContent>
                
               </IonModal>

            ))}

           
        <IonModal ref={modal} trigger="addCat" initialBreakpoint={0.7} breakpoints={[0, 1]}>

                <IonContent className="ion-padding">
                    <IonRow>
                        <IonCol className="ion-text-center">
                            <h2>Add Animal</h2>
                        </IonCol>
                       
                    </IonRow>
                    <IonRow>
                        <IonLabel className="ion-margin-top">Animal Type:</IonLabel>
                        <IonInput
                            onIonInput={(e)=>setCategory(e.target.value as string)}
                            value={category}
                        ></IonInput>
                    </IonRow>
                    <IonRow>
                        <IonLabel className="ion-margin-top">Gestation Period</IonLabel>
                        <IonInput
                            type="number"
                            onIonInput={(e)=>setGestation(e.target.value as number)}
                            value={gestation}
                        ></IonInput>
                    </IonRow>
                   
                    <IonButton expand="block" className="ion-margin-top" onClick={()=>addCategory(category, gestation)}>Add</IonButton>
                </IonContent>
                
               </IonModal>

        <IonFab id="addCat" slot="fixed" vertical="bottom" horizontal="end">
            <IonFabButton>
                <IonIcon icon={add} onClick={()=>clearData()}></IonIcon>
            </IonFabButton>
            
        </IonFab>
        </IonContent>
        
      </IonPage>
    </>

    );
}
export default AddAnimaCategory