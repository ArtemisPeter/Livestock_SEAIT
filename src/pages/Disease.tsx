import React, { useEffect, useRef, useState } from "react";
import SideBar from "./SideBar";
import { IonButton, IonButtons, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonMenuButton, IonModal, IonPage, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar, useIonAlert } from "@ionic/react";
import { add } from "ionicons/icons";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import useSQLiteDB from "../composables/useSQLiteDB";

type disease = {
    id: number,
    disease: string
}

const Disease: React.FC = () => {
    //separate fname etc. for displaying to the card and for input...
   const [disease, setDisease] = useState("");
   const [DiseasesData, setDiseasesData] = useState<Array<disease>>()
    const {performSQLAction, initialized} = useSQLiteDB();
    const [presentAlert] = useIonAlert();

    useEffect(()=>{
        loadDiseases();
       
    }, [initialized])

    const clearData = ()=>{
        setDisease("");
    }

    const loadDiseases = () => {
        try{
           performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
            const data = await db?.query(`SELECT * FROM Disease`);
            setDiseasesData(data?.values);
           })
        }catch(error){
            console.log((error as Error).message);
           
        }
    }
   

    const InsertNew = (feeds:string) =>{
        try{
            performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
             const newVS = await db?.query(`INSERT OR IGNORE INTO Disease (disease) VALUES (?)`, [
                feeds
             ]);
             if(newVS){
                presentAlert({
                    header: "Success",
                    buttons: ['OK']
                });
                setDisease("");
                const data = await db?.query(`SELECT * FROM Disease`);
                setDiseasesData(data?.values);
                await db?.execute('COMMIT');
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
    
    const UpdateData = (disease: string, disease_id: number) =>{
        try{
            performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
                const data = await db?.query(`UPDATE Disease SET disease = ? WHERE id = ?`, [
                    disease, disease_id
                ]);
                if(data){
                    presentAlert({
                        header: "Success",
                        buttons: ['OK']
                    });
                    const data = await db?.query(`SELECT * FROM Disease`);
                    setDiseasesData(data?.values);
                    await db?.execute('COMMIT');
                }
            })
        }catch(error){
            console.log((error as Error).message);
        }
    }

    const editData = (data: disease | undefined)=>{
        if(data){
            setDisease(data.disease);
        }else{
            clearData();
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
                        <IonTitle>Diseases</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                
                {DiseasesData?.map((v)=>(
                    <IonCard key={v.id} id={`cardDisease-${v.id}`} onClick={()=>editData(v)}>
                        <IonCardHeader>
                            <IonCardTitle>{v.disease}</IonCardTitle>
                        </IonCardHeader>
                    </IonCard>
                ))}

                {DiseasesData?.map((vm)=>(
                     <IonModal key={vm.id} ref={modal} trigger={`cardDisease-${vm.id}`} initialBreakpoint={0.6} breakpoints={[0, 1]}>
                     <IonContent className="ion-padding">
                         <IonRow>
                             <IonCol className="ion-text-center">
                                 <h2>Edit {vm.disease}</h2>
                             </IonCol>
                         </IonRow>
                         <IonRow>
                             <IonCol>
                                 <IonInput
                                     label="Name"
                                     labelPlacement="floating"
                                     value={disease}
                                     onIonInput={(e)=>setDisease(e.target.value as string)}
                                 ></IonInput>
                             </IonCol>
                         </IonRow>
                         <IonButton expand="block" className="ion-margin-top" onClick={()=>UpdateData(disease, vm.id)}>Update</IonButton>
                     </IonContent>
                 </IonModal>
                ))}

                <IonModal ref={modal} trigger="addFeeds" initialBreakpoint={0.6} breakpoints={[0, 1]}>
                    <IonContent className="ion-padding">
                        <IonRow>
                            <IonCol className="ion-text-center">
                                <h2>Add Disease</h2>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonInput
                                    label="Name"
                                    labelPlacement="floating"
                                    value={disease}
                                    onIonInput={(e)=>setDisease(e.target.value as string)}
                                ></IonInput>
                            </IonCol>
                        </IonRow>
                       
                        <IonButton expand="block" className="ion-margin-top" onClick={()=>InsertNew(disease)}> Save</IonButton>
                    </IonContent>
                </IonModal>

                </IonContent>
                <IonFab id ="addFeeds" slot="fixed" vertical="bottom" horizontal="end">
                    <IonFabButton>
                        <IonIcon icon={add} onClick={()=>clearData()}></IonIcon>
                    </IonFabButton>
                </IonFab>
            </IonPage>
        </>
    )
}
export default Disease