import React, { useEffect, useRef, useState } from "react";
import SideBar from "./SideBar";
import { IonBadge, IonButton, IonButtons, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonMenu, IonMenuButton, IonModal, IonPage, IonRefresher, IonRefresherContent, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar, RefresherCustomEvent, RefresherEventDetail, useIonAlert } from "@ionic/react";
import { add, checkmark, closeOutline, createOutline } from "ionicons/icons";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import useSQLiteDB from "../composables/useSQLiteDB";

type AnimalHeader = {
    id: number, 
    animal_id: number,
    name: string, 
    status: number, 
    dateCured: string, 
    vet_id: number, 
    vet: string
}

type ListAnimal = {
    id: number,
    name: string
}

type Vet = {
    id: number, 
    name: string
}

type Treatment = {
    id: number, 
    Vaccine_Supplement: string, 
    remedy_id: number, 
    remedy: string
}

type AnimalDiseases = {
    id: number, 
    disease: string
}

type TreatmentSick = {
    id: number, 
    vaccine_supplement_id: number, 
    remarks: string, 
    Vaccine_Supplement: string,
    disease: string,
    status: number,
    disease_animal_header_id:number
}

const Livestock_Disease: React.FC = () => {
    const [AnimalData, setAnimalData] = useState<Array<AnimalHeader>>()
    const {performSQLAction, initialized} = useSQLiteDB();
    const [ListAnimalData, setListAnimalData] = useState<Array<ListAnimal>>()
    const [animal, setAnimal] = useState(0);
    const [ListVet2, setListVet] = useState<Array<Vet>>()
    const [vet, setVet] = useState(0);
    const [presentAlert] = useIonAlert();
    const [TreatmentData, setTreatmentData] = useState<Array<Treatment>>()
    const [treatment, setTreatment] = useState(0);
    const [DiseaseData, setDiseaseData] = useState<Array<AnimalDiseases>>()
    const [disease, setDisease] = useState(0);
    const [DAH_id, setDAH_id] = useState(0);
    const [animal_Tital, setanimal_Tital] = useState("");
    const [remakrs, setRemarks] = useState("");
    const [TreatmentDi, setTreatmentDi] = useState<Array<TreatmentSick>>()
    const [seletectedTreatement, setSelectedTreatment] = useState(0);
    const [selectedRemarks, setSelectedRemarks] = useState("");

    useEffect(()=>{
        loadData();
        loadListAnimal();
        loadVeterenary();
        loadTreatment();
        loadDiseases();
    }, [initialized])

    const RefreshPage2 = (event:CustomEvent<RefresherEventDetail>) =>{
        setTimeout(()=>{
            loadData();
            loadListAnimal();
            loadVeterenary();
            loadTreatment();
            loadDiseases();
            event.detail.complete();
        }, 1000)
       
    }

    const loadData = () =>{
        try{
            performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
                const data = await db?.query(`
                    SELECT DAH.id, DAH.animal_id, A.name As name, DAH.status, DAH.dateCured, DAH.vet_id, P.fname AS vet  FROM Disease_Animal_Header AS DAH
                    INNER JOIN Animal as A ON A.id = DAH.animal_id
                    INNER JOIN Person AS P ON P.id = DAH.vet_id`
                )
                setAnimalData(data?.values)
            })
        }catch(error){
            console.log((error as Error).message);
        }
    }

    const loadListAnimal = () =>{
        try{
            performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
                const data = await db?.query(`
                    SELECT id, name FROM Animal     
                `);
                setListAnimalData(data?.values)
            })
        }catch(error){
            console.log((error as Error).message);
        }
    }

    const loadVeterenary = () =>{
        try{
            performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
                const dataVet = await db?.query(`
                    SELECT id, fname as name FROM Person WHERE role_id = 1
                `);
                setListVet(dataVet?.values)
               
            })
        }catch(error){
            console.log((error as Error).message);
          
        }
    }

    const addDiseaseAnimalLive = (animal_id:number, vet_id:number) =>{
        try{
            performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
                const data = await db?.query(`
                   INSERT INTO Disease_Animal_Header (animal_id, dateCreated, status, dateCured, vet_id)
                   VALUES (?, DATE('now'), ?, ?, ?)
                `, [
                    animal_id, 0, "", vet_id
                ]);
                if(data){
                    presentAlert({
                        header: "Success",
                        buttons: ['OK']
                    })
                    const data = await db?.query(`
                        SELECT DAH.id, DAH.animal_id, A.name As name, DAH.status, DAH.dateCured, DAH.vet_id, P.fname AS vet  FROM Disease_Animal_Header AS DAH
                        INNER JOIN Animal as A ON A.id = DAH.animal_id
                        INNER JOIN Person AS P ON P.id = DAH.vet_id`
                    )

                    const updateToSick = await db?.query(`
                            UPDATE Animal SET health_status_id = 2 WHERE id = ?
                        `, [animal_id]);

                    setAnimalData(data?.values)
                    await db?.execute('COMMIT');
                }
            })
        }catch(error){
            console.log((error as Error).message);
        }
    }

    const loadTreatment = () =>{
        try{
            performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
                const data = await db?.query(`
                    SELECT VS.id, VS.Vaccine_Supplement, VS.remedy_id, R.remedy FROM Vaccine_Supplement AS VS 
                    INNER JOIN Remedy AS R ON R.id = VS.remedy_id WHERE VS.remedy_id = 1
                `);
                setTreatmentData(data?.values)
            })
        }catch(error){
            console.log((error as Error).message);
        }
    }

    const loadDiseases = () => {
        try {
            performSQLAction(async (db: SQLiteDBConnection | undefined) => {
                const data = await db?.query(`
                    SELECT id, disease FROM Disease
                `);
                setDiseaseData(data?.values);
            });
        } catch (error) {
            console.log((error as Error).message);
        }
    };

    const EditData = (data: AnimalHeader | undefined)=>{
        if(data){
            setDAH_id(data?.id);
            setanimal_Tital(data.name);
            ViewAllTreatment(data.id)
        }
        
    }

    const InsertTreatment = async (
        dah_id: number,
        vaccine_supplement_id: number,
        remarks: string,
        disease_id:number
    ) => {
        try {
            const dateCreated = new Date().toISOString(); // Generate the current date in ISO format
    
            performSQLAction(async (db: SQLiteDBConnection | undefined) => {
                const data =  await db?.query(`
                    INSERT INTO Disease_Animal_Detail 
                        (disease_animal_header_id, vaccine_supplement_id, remarks, dateCreated, status, disease_id)
                    VALUES (?, ?, ?, ?, 0, ?)
                `, [dah_id, vaccine_supplement_id, remarks, dateCreated, disease_id]);
                if(data){
                    presentAlert({
                        header: "Success",
                        buttons: ['OK']
                    })
                    setRemarks("");
                    setTreatment(0);
                    setDisease(0);
                    const data = await db?.query(`
                        SELECT DAD.id, DAD.vaccine_supplement_id, DAD.remarks, VS.Vaccine_Supplement, DAH.disease, DAD.status FROM Disease_Animal_Detail AS DAD
                        INNER JOIN Vaccine_Supplement AS VS ON VS.id = DAD.vaccine_supplement_id
                        INNER JOIN Disease AS DAH ON DAH.id = DAD.disease_id
                        WHERE disease_animal_header_id = ? AND DAD.status = 0 OR DAD.status = 1
                    `, [dah_id]);
                    setTreatmentDi(data?.values);
                }else{
                    presentAlert({
                        header: "Error",
                        buttons: ['OK']
                    })
                }
            });
    
            console.log("Insert successful");
        } catch (error) {
            console.log((error as Error).message);
        }
    };

    const ViewAllTreatment = (dah_id: number) => {
        try{
            performSQLAction(async (db: SQLiteDBConnection | undefined) => {
                const data = await db?.query(`
                    SELECT DAD.id, DAD.vaccine_supplement_id, DAD.remarks, VS.Vaccine_Supplement, DAH.disease, DAD.status, DAD.disease_animal_header_id FROM Disease_Animal_Detail AS DAD
                    INNER JOIN Vaccine_Supplement AS VS ON VS.id = DAD.vaccine_supplement_id
                    INNER JOIN Disease AS DAH ON DAH.id = DAD.disease_id
                    WHERE DAD.disease_animal_header_id = ? AND DAD.status <> 2 
                `, [dah_id]);
                setTreatmentDi(data?.values);
                console.log(data)
                console.log(dah_id)
            });
        }catch (error) {
            console.log((error as Error).message);
        }
    }

    const UpdateSelectedTreatment = (selected_vaccine_supplement_id:number, selected_remarks:string, id:number, dah_id:number) =>{
        try{
            performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
                const data = await db?.query(`
                    UPDATE Disease_Animal_Detail SET vaccine_supplement_id = ?,
                    remarks = ? WHERE id = ?
                `, [selected_vaccine_supplement_id, selected_remarks, id]);

                if(data){
                    presentAlert({
                        header: "Success",
                        buttons: ['OK']
                    });
                    const data = await db?.query(`
                       SELECT DAD.id, DAD.vaccine_supplement_id, DAD.remarks, VS.Vaccine_Supplement, DAH.disease, DAD.status, DAD.disease_animal_header_id FROM Disease_Animal_Detail AS DAD
                    INNER JOIN Vaccine_Supplement AS VS ON VS.id = DAD.vaccine_supplement_id
                    INNER JOIN Disease AS DAH ON DAH.id = DAD.disease_id
                    WHERE DAD.disease_animal_header_id = ? AND DAD.status <> 2 
                    `, [DAH_id]);
                    setTreatmentDi(data?.values);
                }
            })
        }catch (error) {
            console.log((error as Error).message);
        }
    }
//0 = sick, 1 = healed, 2 = archive
const HealedSelectedTreatment = (dah_id:number, animal_id:number) =>{
    try{
        performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
            const data = await db?.query(`
                UPDATE Disease_Animal_Header SET status = 1,
                dateCured = DATE('now') WHERE id = ?
            `, [dah_id]);

            const data2 = await db?.query(`
                UPDATE Animal SET health_status_id = 1
                 WHERE id = ?
            `, [animal_id]);

            if(data){
                presentAlert({
                    header: "Success",
                    buttons: ['OK']
                });
                const data = await db?.query(`
                    SELECT DAH.id, DAH.animal_id, A.name As name, DAH.status, DAH.dateCured, DAH.vet_id, P.fname AS vet  FROM Disease_Animal_Header AS DAH
                    INNER JOIN Animal as A ON A.id = DAH.animal_id
                    INNER JOIN Person AS P ON P.id = DAH.vet_id`
                )
                setAnimalData(data?.values)
            }
        })
    }catch (error) {
        console.log((error as Error).message);
    }
}
    const DeleteSelectedTreatment = (id:number, dah_id:number) =>{
        try{
            performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
                const data = await db?.query(`
                    UPDATE Disease_Animal_Detail SET status = ? WHERE id = ?
                `, [2, id]);

                if(data){
                    presentAlert({
                        header: "Success",
                        buttons: ['OK']
                    });
                    const data = await db?.query(`
                       SELECT DAD.id, DAD.vaccine_supplement_id, DAD.remarks, VS.Vaccine_Supplement, DAH.disease, DAD.status, DAD.disease_animal_header_id FROM Disease_Animal_Detail AS DAD
                    INNER JOIN Vaccine_Supplement AS VS ON VS.id = DAD.vaccine_supplement_id
                    INNER JOIN Disease AS DAH ON DAH.id = DAD.disease_id
                    WHERE DAD.disease_animal_header_id = ? AND DAD.status <> 2 
                    `, [DAH_id]);
                    setTreatmentDi(data?.values);
                }
            })
        }catch (error) {
            console.log((error as Error).message);
        }
    }

    const DoneSelectedTreatment = (id:number, dah_id:number) =>{
        try{
            performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
                const data = await db?.query(`
                    UPDATE Disease_Animal_Detail SET status = ? WHERE id = ?
                `, [1, id]);

                if(data){
                    presentAlert({
                        header: "Success",
                        buttons: ['OK']
                    });
                    const data = await db?.query(`
                       SELECT DAD.id, DAD.vaccine_supplement_id, DAD.remarks, VS.Vaccine_Supplement, DAH.disease, DAD.status, DAD.disease_animal_header_id FROM Disease_Animal_Detail AS DAD
                    INNER JOIN Vaccine_Supplement AS VS ON VS.id = DAD.vaccine_supplement_id
                    INNER JOIN Disease AS DAH ON DAH.id = DAD.disease_id
                    WHERE DAD.disease_animal_header_id = ? AND DAD.status <> 2 
                    `, [DAH_id]);
                    setTreatmentDi(data?.values);
                }
            })
        }catch (error) {
            console.log((error as Error).message);
        }
    }

    const EditThisTreatment = (treatment_id:number, remarkss:string) =>{
        if(treatment_id){
            setTreatment(treatment_id)
            setRemarks(remarkss)
        }
    }
        
    
    const reloadAnimal = () =>{
        loadListAnimal()
        loadDiseases();
    }

    const modalLiveStock_D2 = useRef<HTMLIonModalElement>(null);
    const modalLiveStock_D = useRef<HTMLIonModalElement>(null);
    return(
        <>
            <SideBar />
            <IonPage id="main-content"> 
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonMenuButton></IonMenuButton>
                        </IonButtons>
                        <IonTitle>Animal Disease</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <IonRefresher slot="fixed" onIonRefresh={RefreshPage2}>
                        <IonRefresherContent></IonRefresherContent>
                    </IonRefresher>

                    {AnimalData?.map((dah)=>(
                        <IonCard key={dah.id} id={`Animal_${dah.id}`} color={dah.status === 0 ? "danger " :dah.status === 1 ? "success" : "dark"} onClick={()=>EditData(dah)}>
                            <IonCardHeader>
                                <IonCardTitle>{dah.name}</IonCardTitle>
                                <IonCardSubtitle>{dah.status === 0 ? 'Sick' : dah.status === 1 ? 'Healed' : 'Dead'}</IonCardSubtitle>
                            </IonCardHeader>
                        </IonCard>
                    ))}
                
                    {AnimalData?.map((d)=>(
                        <IonModal key={d.id} ref={modalLiveStock_D2} trigger={`Animal_${d.id}`} initialBreakpoint={1} breakpoints={[0, 1]}>
                            <IonContent className="ion-padding">
                                <IonRow className="ion-text-center">
                                    <IonCol><h2>Lists of Treatment for {animal_Tital}</h2></IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonSelect label="Disease" value={disease} onIonChange={(e)=>setDisease(e.target.value as number)} labelPlacement="floating">
                                        {DiseaseData?.map((dm)=>(
                                            <IonSelectOption key={dm.id} value={dm.id}>{dm.disease}</IonSelectOption>
                                        ))}
                                    </IonSelect>
                                </IonRow>
                                <IonRow>
                                    <IonSelect label="Treatment" value={treatment} onIonChange={(e)=>setTreatment(e.target.value as number)} labelPlacement="floating">
                                        {TreatmentData?.map((t)=>(
                                            <IonSelectOption key={t.id} value={t.id}>{t.Vaccine_Supplement} | {t.remedy}</IonSelectOption>
                                        ))}
                                        
                                    </IonSelect>
                                </IonRow>
                                <IonRow>
                                    <IonInput label="Remarks" labelPlacement="floating" value={remakrs} onIonInput={(e)=>setRemarks(e.target.value as string)}>
                                    </IonInput>
                                </IonRow>
                                <IonButton className="ion-margin-top ion-margin-bottom" expand="block" onClick={()=>InsertTreatment(DAH_id, treatment, remakrs, disease)}>Save</IonButton>
                                <IonButton className="ion-margin-bottom" color="success" expand="block" onClick={()=>HealedSelectedTreatment(DAH_id, d.animal_id)}>Recovered</IonButton>

                                {TreatmentDi?.map((tdm)=>(
                                <IonRow key={tdm.id}>
                                    <IonItemSliding>
                                        <IonItemOptions side="end">
                                            <IonItemOption color="white" id={`edit${tdm.id}`}><IonIcon slot="icon-only" icon={createOutline} onClick={()=>EditThisTreatment(tdm.vaccine_supplement_id, tdm.remarks)}></IonIcon></IonItemOption>
                                            <IonItemOption color="success" onClick={()=>DoneSelectedTreatment(tdm.id, DAH_id)}><IonIcon slot="icon-only" icon={checkmark} ></IonIcon></IonItemOption>
                                            <IonItemOption color="danger" onClick={()=>DeleteSelectedTreatment(tdm.id, DAH_id)}><IonIcon slot="icon-only" icon={closeOutline} ></IonIcon></IonItemOption>
                                        </IonItemOptions>
                                        <IonItem>
                                            <IonBadge slot="start" color="success">{tdm.status === 1 ? <IonIcon icon={checkmark}></IonIcon> : ""}</IonBadge>
                                            <IonLabel><h1>{tdm.disease} | {tdm.Vaccine_Supplement}</h1><small>{tdm.remarks}</small></IonLabel>
                                        </IonItem>
                                    </IonItemSliding>
                                </IonRow>
                                ))}

                                {TreatmentDi?.map((et)=>(
                                  <IonModal key={et.id} ref={modalLiveStock_D} trigger={`edit${et.id}`} initialBreakpoint={0.7} breakpoints={[0,1]}>
                                  <IonContent className="ion-padding">
                                      <IonRow>
                                          <IonCol className="ion-text-center">
                                              <h2>Edit {et.Vaccine_Supplement}</h2>
                                          </IonCol>
                                      </IonRow>
                                      <IonRow>
                                          <IonCol>
                                          <IonSelect label="Treatment" value={treatment} onIonChange={(e)=>setTreatment(e.target.value as number)} labelPlacement="floating">
                                                {TreatmentData?.map((t)=>(
                                                    <IonSelectOption key={t.id} value={t.id}>{t.Vaccine_Supplement} | {t.remedy}</IonSelectOption>
                                                ))}
                                    </IonSelect>
                                          </IonCol>
                                      </IonRow>
                                      <IonRow>
                                          <IonCol>
                                              <IonInput label="Remarks" labelPlacement="floating" value={remakrs} onIonInput={(e)=>{setRemarks(e.target.value as string)}}>

                                              </IonInput>
                                          </IonCol>
                                      </IonRow>
                                      <IonButton className="ion-margin-top ion-margin-bottom" expand="block" onClick={()=>UpdateSelectedTreatment(seletectedTreatement,selectedRemarks, et.id, DAH_id)}>Update</IonButton>
                                     
                                  </IonContent>
                              </IonModal>
                                ))}
                               
                            </IonContent>
                        </IonModal>
                    ))}

                <IonModal ref={modalLiveStock_D} trigger="addLDisease" initialBreakpoint={0.7} breakpoints={[0,1]}>
                    <IonContent className="ion-padding">
                        <IonRow>
                            <IonCol className="ion-text-center">
                                <h2>Add Animal</h2>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonSelect label="Animal" value={animal} onClick={()=>reloadAnimal()} onIonChange={(e)=>setAnimal(e.target.value as number)} labelPlacement="floating">
                                    {ListAnimalData?.map((ld)=>(
                                        <IonSelectOption value={ld.id} key={`l${ld.id}`}>{ld.name}</IonSelectOption>
                                    ))}
                                </IonSelect>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonSelect label="Veterenary" value={vet} onIonChange={(e)=>setVet(e.target.value as number)} onClick={()=>loadVeterenary()} labelPlacement="floating">
                                    {ListVet2?.map((lm)=>(
                                        <IonSelectOption key={`l${lm.id}`} value={lm.id}>{lm.name}</IonSelectOption>
                                    ))}
                                </IonSelect>
                            </IonCol>
                        </IonRow>
                        <IonButton className="ion-margin-top ion-margin-bottom" expand="block" onClick={()=>addDiseaseAnimalLive(animal, vet)}>Save</IonButton>
                       
                    </IonContent>
                </IonModal>

                </IonContent>
                <IonFab  id ="addLDisease" slot="fixed" vertical="bottom" horizontal="end">
                    <IonFabButton onClick={()=>RefreshPage2}>
                        <IonIcon icon={add} onClick={()=>loadVeterenary()}></IonIcon>
                    </IonFabButton>
                </IonFab>
            </IonPage>
        </>
    )

}
export default Livestock_Disease;