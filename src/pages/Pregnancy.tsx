import React, { useEffect, useRef, useState } from "react";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import useSQLiteDB from "../composables/useSQLiteDB";
import { IonBadge, IonButton, IonContent, IonIcon, IonInput, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonModal, IonRoute, IonRow, useIonAlert } from "@ionic/react";
import { createOutline, checkmark, alertOutline, closeOutline } from "ionicons/icons";

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
    Breeder_Date: string
}

const Pregnancy: React.FC<animalID> = ({ animal_id }) => {
    const {performSQLAction, initialized} = useSQLiteDB();
    const [PregnancyData, setPregnancyData] = useState<Array<Pregnancy>>();
    const [presentAlert] = useIonAlert();
    const [ExpDue, setExpDue] = useState("");

  

    useEffect(()=>{
        loadPregnancy(animal_id);
       
    }, [initialized]);
   

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
                    alert(data?.values[0].id)
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

    const editDataPreg = (data: Pregnancy | undefined) =>{
        if(data){
            setExpDue(data.ExpDueDate);
        }
    }

    const modalPregnancy = useRef<HTMLIonModalElement>(null);
    return (
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
                                    <IonItemOption color="white" id={`preg-${p.PregId}`} onClick={()=>editDataPreg(p)} disabled={p.PregStat === 'Failed'}><IonIcon slot="icon-only" icon={createOutline} ></IonIcon></IonItemOption>
                                    <IonItemOption color="success"  disabled={p.PregStat === 'Failed'}><IonIcon slot="icon-only" icon={checkmark} ></IonIcon></IonItemOption>
                                    <IonItemOption color="warning" onClick={() => FailedPreg(p.PregId, p.ED_id, p.EH_id)} disabled={p.PregStat === 'Failed'}><IonIcon slot="icon-only" icon={alertOutline} /></IonItemOption>

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

        </div>
    );
}

export default Pregnancy;
