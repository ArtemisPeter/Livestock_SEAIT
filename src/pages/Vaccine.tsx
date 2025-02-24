import React, { useEffect, useRef, useState } from "react";
import SideBar from "./SideBar";
import { IonButton, IonButtons, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonMenuButton, IonModal, IonPage, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar, useIonAlert } from "@ionic/react";
import { add } from "ionicons/icons";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import useSQLiteDB from "../composables/useSQLiteDB";

type VS = {
    id: number,
    Vaccine_Supplement: string,
    remedy_id: number,
    remedy: string
}

type type = {
    id: number,
    remedy: string
}

const Vaccine: React.FC = () => {
    //separate fname etc. for displaying to the card and for input...
    const [vs, setVS] = useState("");
    const [type, setType] = useState(0);
    const [VacSupData, setVacSupData] = useState<Array<VS>>()
    const [typeData, setTypeData] = useState<Array<type>>(); 
    const {performSQLAction, initialized} = useSQLiteDB();
    const [presentAlert] = useIonAlert();

    useEffect(()=>{
        loadVaccines();
        loadTypes();
    }, [initialized])

    const clearData = ()=>{
        setVS("");
        setType(0);
    }

    const loadVaccines = () => {
        try{
           performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
            const data = await db?.query(`SELECT vs.id, vs.Vaccine_Supplement, vs.remedy_id, r.remedy FROM Vaccine_Supplement AS vs INNER JOIN Remedy AS R ON R.id = vs.remedy_id`);
            setVacSupData(data?.values);
           })
        }catch(error){
            console.log((error as Error).message);
            setVacSupData([]);
        }
    }

    const loadTypes = () =>{
        try{
            performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
             const data = await db?.query(`SELECT * FROM Remedy`);
             setTypeData(data?.values);
            })
         }catch(error){
             console.log((error as Error).message);
             setTypeData([]);
         }
    }   

    const InsertNew = (name:string, remedy_id:number) =>{
        try{
            performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
             const newVS = await db?.query(`INSERT OR IGNORE INTO Vaccine_Supplement (Vaccine_Supplement, remedy_id) VALUES (?, ?)`, [
                name, remedy_id
             ]);
             if(newVS){
                presentAlert({
                    header: "Success",
                    buttons: ['OK']
                });
                const data = await db?.query(`SELECT vs.id, vs.Vaccine_Supplement, vs.remedy_id, r.remedy FROM Vaccine_Supplement AS vs INNER JOIN Remedy AS R ON R.id = vs.remedy_id`);
                setVacSupData(data?.values);
                clearData();
                await db?.execute('COMMIT');
             }else{
                presentAlert({
                    header: "Error",
                    buttons: ['OK']
                })
             }
             clearData();
            })
         }catch(error){
             console.log((error as Error).message);
         }
    }

    const UpdateData = (vaccine: string, remedy_id: number, id:number)=>{
        try{
            performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
                const data = await db?.query(`UPDATE Vaccine_Supplement SET Vaccine_Supplement = ?, remedy_id = ? WHERE id = ?`, [
                    vaccine, remedy_id, id
                ]);
                if(data){
                    presentAlert({
                        header: "Success",
                        buttons: ['OK']
                    });
                    const data = await db?.query(`SELECT vs.id, vs.Vaccine_Supplement, vs.remedy_id, r.remedy FROM Vaccine_Supplement AS vs INNER JOIN Remedy AS R ON R.id = vs.remedy_id`);
                    setVacSupData(data?.values);
                    await db?.execute('COMMIT');
                }
            })
        }catch(error){
            console.log((error as Error).message);
        }
    }
    
    const editData = (data: VS | undefined)=>{
        if(data){
            setVS(data.Vaccine_Supplement);
            setType(data.remedy_id);
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
                        <IonTitle>Vaccine / Supplement</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                
                {VacSupData?.map((v)=>(
                    <IonCard key={v.id} id={`card-${v.id}`} onClick={()=>editData(v)}>
                        <IonCardHeader>
                            <IonCardTitle>{v.Vaccine_Supplement}</IonCardTitle>
                            <IonCardSubtitle>{v.remedy}</IonCardSubtitle>
                        </IonCardHeader>
                    </IonCard>
                ))}

                {VacSupData?.map((vm)=>(
                     <IonModal key={vm.id} ref={modal} trigger={`card-${vm.id}`} initialBreakpoint={0.6} breakpoints={[0, 1]}>
                     <IonContent className="ion-padding">
                         <IonRow>
                             <IonCol className="ion-text-center">
                                 <h2>Edit {vm.Vaccine_Supplement}</h2>
                             </IonCol>
                         </IonRow>
                         <IonRow>
                             <IonCol>
                                 <IonInput
                                     label="Name"
                                     labelPlacement="floating"
                                     value={vs}
                                     onIonInput={(e)=>setVS(e.target.value as string)}
                                 ></IonInput>
                             </IonCol>
                         </IonRow>
                         <IonRow>
                             <IonCol>
                                 <IonSelect label="Type" labelPlacement="floating" value={type} onIonChange={(e)=>{setType(e.target.value as number)}}>
                                     {typeData?.map((t)=>(
                                         <IonSelectOption key={t.id} value={t.id}>{t.remedy}</IonSelectOption>
                                     ))}
                                 </IonSelect>
                             </IonCol>
                         </IonRow>
                         <IonButton expand="block" className="ion-margin-top" onClick={()=>UpdateData(vs, type, vm.id)}>Update</IonButton>
                     </IonContent>
                 </IonModal>
                ))}

                <IonModal ref={modal} trigger="addVS" initialBreakpoint={0.6} breakpoints={[0, 1]}>
                    <IonContent className="ion-padding">
                        <IonRow>
                            <IonCol className="ion-text-center">
                                <h2>Add Vaccine/Supplement</h2>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonInput
                                    label="Name"
                                    labelPlacement="floating"
                                    value={vs}
                                    onIonInput={(e)=>setVS(e.target.value as string)}
                                ></IonInput>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonSelect label="Type" labelPlacement="floating" value={type} onIonChange={(e)=>{setType(e.target.value as number)}}>
                                    {typeData?.map((t)=>(
                                        <IonSelectOption key={t.id} value={t.id}>{t.remedy}</IonSelectOption>
                                    ))}
                                </IonSelect>
                            </IonCol>
                        </IonRow>
                        <IonButton expand="block" className="ion-margin-top" onClick={()=>InsertNew(vs, type)}> Save</IonButton>
                    </IonContent>
                </IonModal>

                </IonContent>
                <IonFab id ="addVS" slot="fixed" vertical="bottom" horizontal="end">
                    <IonFabButton>
                        <IonIcon icon={add} onClick={()=>clearData()}></IonIcon>
                    </IonFabButton>
                </IonFab>
            </IonPage>
        </>
    )
}
export default Vaccine