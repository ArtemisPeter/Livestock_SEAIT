import React, { useEffect, useRef, useState } from "react";
import SideBar from "./SideBar";
import { IonButton, IonButtons, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonMenuButton, IonModal, IonPage, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar, useIonAlert } from "@ionic/react";
import { add } from "ionicons/icons";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import useSQLiteDB from "../composables/useSQLiteDB";

type Feeds = {
    id: number,
    feeds: string
}

const Feeds: React.FC = () => {
    //separate fname etc. for displaying to the card and for input...ss
   const [feeds, setFeeds] = useState("");
   const [feedsData, setFeedsData] = useState<Array<Feeds>>()
    const {performSQLAction, initialized} = useSQLiteDB();
    const [presentAlert] = useIonAlert();

    useEffect(()=>{
        loadFeeds();
       
    }, [initialized])

    const clearData = ()=>{
        //alert("HS")
        setFeeds("");
    }

    const loadFeeds = () => {
        try{
           performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
            const data = await db?.query(`SELECT * FROM Feeds`);
            setFeedsData(data?.values);
           })
        }catch(error){
            console.log((error as Error).message);
           
        }
    }
   

    const InsertNew = (feeds:string) =>{
        try{
            performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
             const newVS = await db?.query(`INSERT OR IGNORE INTO Feeds (feeds) VALUES (?)`, [
                feeds
             ]);
             if(newVS){
                presentAlert({
                    header: "Success",
                    buttons: ['OK']
                });
                const data = await db?.query(`SELECT * FROM Feeds`);
                setFeedsData(data?.values);
                clearData();
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
    
    const UpdateData = (feeds: string, feeds_id: number) =>{
        try{
            performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
                const data = await db?.query(`UPDATE Feeds SET feeds = ? WHERE id = ?`, [
                    feeds, feeds_id
                ]);
                if(data){
                    presentAlert({
                        header: "Success",
                        buttons: ['OK']
                    });
                    const data = await db?.query(`SELECT * FROM Feeds`);
                    setFeedsData(data?.values);
                    await db?.execute('COMMIT');
                }
            })
        }catch(error){
            console.log((error as Error).message);
        }
    }

    const editData = (data: Feeds | undefined)=>{
        if(data){
            setFeeds(data.feeds);
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
                        <IonTitle>Feeds</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                
                {feedsData?.map((v)=>(
                    <IonCard key={v.id} id={`cardFeeds-${v.id}`} onClick={()=>editData(v)}>
                        <IonCardHeader>
                            <IonCardTitle>{v.feeds}</IonCardTitle>
                        </IonCardHeader>
                    </IonCard>
                ))}

                {feedsData?.map((vm)=>(
                     <IonModal key={vm.id} ref={modal} trigger={`cardFeeds-${vm.id}`} initialBreakpoint={0.6} breakpoints={[0, 1]}>
                     <IonContent className="ion-padding">
                         <IonRow>
                             <IonCol className="ion-text-center">
                                 <h2>Edit {vm.feeds}</h2>
                             </IonCol>
                         </IonRow>
                         <IonRow>
                             <IonCol>
                                 <IonInput
                                     label="Name"
                                     labelPlacement="floating"
                                     value={feeds}
                                     onIonInput={(e)=>setFeeds(e.target.value as string)}
                                 ></IonInput>
                             </IonCol>
                         </IonRow>
                         <IonButton expand="block" className="ion-margin-top" onClick={()=>UpdateData(feeds, vm.id)}>Update</IonButton>
                     </IonContent>
                 </IonModal>
                ))}

                <IonModal ref={modal} trigger="addDisease" initialBreakpoint={0.6} breakpoints={[0, 1]}>
                    <IonContent className="ion-padding">
                        <IonRow>
                            <IonCol className="ion-text-center">
                                <h2>Add Feeds</h2>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonInput
                                    label="Name"
                                    labelPlacement="floating"
                                    value={feeds}
                                    onIonInput={(e)=>setFeeds(e.target.value as string)}
                                ></IonInput>
                            </IonCol>
                        </IonRow>
                       
                        <IonButton expand="block" className="ion-margin-top" onClick={()=>InsertNew(feeds)}> Save</IonButton>
                    </IonContent>
                </IonModal>

                </IonContent>
                <IonFab id ="addDisease" slot="fixed" vertical="bottom" horizontal="end">
                    <IonFabButton>
                        <IonIcon icon={add} onClick={()=>clearData()}></IonIcon>
                    </IonFabButton>
                </IonFab>
            </IonPage>
        </>
    )
}
export default Feeds