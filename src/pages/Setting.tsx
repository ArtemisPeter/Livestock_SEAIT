import React, { useEffect, useRef, useState } from "react";
import SideBar from "./SideBar";
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonMenuButton, IonModal, IonPage, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar, useIonAlert } from "@ionic/react";
import { add } from "ionicons/icons";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import useSQLiteDB from "../composables/useSQLiteDB";



const Setting: React.FC = () => {
    const [newPin, setNewPin] = useState("");
    const {performSQLAction, initialized} = useSQLiteDB();
    const [presentAlert] = useIonAlert();

    //separate fname etc. for displaying to the card and for input...
    
    useEffect(()=>{
      loadPerson();
    }, [initialized])

       const loadPerson = () =>{
            try{
                performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
                    const data = await db?.query(`SELECT * FROM User 
                        
                        `);
                    console.log(data);
                })
            }catch(error){
                console.log((error as Error).message);
               
            }
        }
    const updatePerson = (newPin:number) =>{
       
            try{
                performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
                    const newP = await db?.query(`UPDATE User SET pincode = ?`, [
                        newPin
                    ])
                    if(newP){
                        setNewPin("");
                        presentAlert({
                            header: "Successfully Changed!",
                            buttons: ['OK']
                        })
                        //clearData()
                        await db?.execute('COMMIT');
                        
                    }else{
                        presentAlert({
                            header: "Error",
                            buttons: ['OK']
                        })
                    }
                })
            }catch(error){
                console.log((error as Error).message)
            }
        

        //clearData()
    }
    const clearData = () =>{
        setNewPin("");
    }
    return(
        <>
            <SideBar />
            <IonPage id="main-content">
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonMenuButton></IonMenuButton>
                        </IonButtons>
                        <IonTitle>Setting</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">

                    <IonCard>
                        <IonCardContent>
                            <IonItem>
                            <IonInput
                                label="Change Pin"
                                labelPlacement="floating"
                                type="password"
                                inputmode="numeric"
                                maxlength={4}
                                value={newPin}
                                pattern="\d{4}"
                                onIonInput={(e)=>setNewPin(e.target.value as any)}
                            ></IonInput>            
                            
                            </IonItem>
                            <IonButton className="ion-margin-top" expand="block" onClick={()=> updatePerson(newPin)}> Save </IonButton>
                        </IonCardContent>
                    </IonCard>
                    
                </IonContent>
               
            </IonPage>
        </>
    )
}
export default Setting