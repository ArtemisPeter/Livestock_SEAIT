import React, { useEffect, useRef, useState } from "react";
import { add, addCircle, addCircleOutline, addOutline, checkmark, closeOutline, createOutline, listCircleOutline, listOutline, playCircle, radio, trashOutline } from "ionicons/icons";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import useSQLiteDB from "../composables/useSQLiteDB";
import { IonAlert, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonMenu, IonMenuButton, IonModal, IonPage, IonRefresher, IonRefresherContent, IonRow, IonSelect, IonSelectOption, IonTab, IonTabBar, IonTabButton, IonTabs, IonTitle, IonToolbar, RefresherEventDetail, useIonAlert } from "@ionic/react";
import SideBar from "./SideBar";
import { s } from "vitest/dist/reporters-5f784f42";

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

const LiveStock_Feed: React.FC = () =>{
    const {performSQLAction, initialized} = useSQLiteDB();
    const [presentAlert] = useIonAlert();
    const [AnimalData, setAnimalData] = useState<Array<AllAnimals>>()
    const [FeedsData, setFeeds] = useState<Array<Feeds>>()
    const [SupplementData, setSupplementData] = useState<Array<Supplement>>();
    const [FAHid, setFAHid] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [FAD_FeedsData, setFAD_FeedsData] = useState<Array<FAD_Feeds>>();
    const [FAD_SupplementData, setFAD_SupplementData] = useState<Array<FAD_Supplement>>();
    const [feeds, setFeed] = useState(0);
    const [feedsR, setFeedsR] = useState("")
    const [supplment, setSupplement] = useState(0);
    const [supplmentR, setSupplementR] = useState("");

    useEffect(()=>{
        loadData();
        loadFeeds();
        loadSup();
    }, [initialized])

    const loadData = () =>{
        try{
            performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
                const data = await db?.query(`
                        SELECT FAH.id, A.id, A.name, B.breed FROM Feed_Animal_Header AS FAH 
                        INNER JOIN Animal AS A ON A.id = FAH.animal_id
                        INNER JOIN Breed AS B ON B.id = breed_id
                        WHERE A.archive = 0
                    `);
                setAnimalData(data?.values);
             
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

    const InsertNewFeeds = (FAH_id:number, feeds_id:number, feeds_remarks:string) =>{
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
                        `, [FAH_id, feeds_id, feeds_remarks]);
                   if(data){
                        presentAlert({
                            header: "Success",
                            buttons: ['OK']
                        });
                        const data = await db?.query(`
                            SELECT F.id, F.Feed_Animal_Header, F.feeds_id, FE.feeds, F.feeds_remarks, F.status FROM Feed_Animal_Details_Feeds AS F 
                            INNER JOIN Feeds AS FE ON FE.id = F.feeds_id
                            WHERE F.Feed_Animal_Header = ? AND status = 0
                        `, [FAH_id])
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

    const InsertNewSupplement = (FAH_id:number, feeds_id:number, feeds_remarks:string) =>{
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
                        `, [FAH_id, feeds_id, feeds_remarks]);
                   if(data){
                        presentAlert({
                            header: "Success",
                            buttons: ['OK']
                        });
                        const data = await db?.query(`
                            SELECT F.id, F.Feed_Animal_Header, F.Vaccine_Supplement_id, FE.Vaccine_Supplement, F.Supplement_Remarks, F.status FROM Feed_Animal_Details_Supplement AS F 
                            INNER JOIN Vaccine_Supplement AS FE ON FE.id = F.Vaccine_Supplement_id
                            WHERE F.Feed_Animal_Header = ? AND status = 0
                        `, [FAH_id])
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

    const UpdateFeeds = (feeds_id:number, remarks:string, id:number, FAH_id:number) =>{
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
                    `, [FAH_id])
                setFAD_FeedsData(data?.values);
                await db?.execute('COMMIT');
                
               }
            })
        }catch(error){
            console.log((error as Error).message)
        }
    }

    const UpdateSupp = (sup:number, remarks:string, id:number, FAH_id:number) =>{
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
                    `, [FAH_id])
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

    const DoneFeeds = (id:number, FAH_id:number) =>{
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
                    `, [FAH_id])
                setFAD_FeedsData(data?.values);
                await db?.execute('COMMIT');
                
               }
            })
        }catch(error){
            console.log((error as Error).message)
        }
    }

    const DoneSupplement = (id:number, FAH_id:number) =>{
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
                    `, [FAH_id])
                setFAD_SupplementData(datas?.values);
                await db?.execute('COMMIT');
                
               }
            })
        }catch(error){
            console.log((error as Error).message)
        }
    }

//1 = done and 2 is deleted
    const ArchiveFeeds = (id:number, FAH_id:number) =>{
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
                    `, [FAH_id])
                setFAD_FeedsData(data?.values);
                await db?.execute('COMMIT');
                
               }
            })
        }catch(error){
            console.log((error as Error).message)
        }
    }

    const ArchiveSupp = (id:number, FAH_id:number) =>{
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
                    `, [FAH_id])
                setFAD_SupplementData(datas?.values);
                await db?.execute('COMMIT');
                
               }
            })
        }catch(error){
            console.log((error as Error).message)
        }
    }


    const editData = (data: AllAnimals | undefined) =>{
        if(data){
            setFAHid(data.id)
            loadFAD_F(data.id)
            loadFAD_S(data.id)

            if(isOpen){
                setIsOpen(false)
            }
            setIsOpen(true)
            loadFeeds()
            
        }
    }

    const loadFAD_F = (id:number) =>{
        try{
            performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
                const data = await db?.query(`
                        SELECT F.id, F.Feed_Animal_Header, F.feeds_id, FE.feeds, F.feeds_remarks, F.status FROM Feed_Animal_Details_Feeds AS F 
                        INNER JOIN Feeds AS FE ON FE.id = F.feeds_id
                        WHERE F.Feed_Animal_Header = ? AND status = 0
                    `, [id])
                setFAD_FeedsData(data?.values);
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
            loadData();
            loadFeeds();
            loadSup();
            event.detail.complete();
        }, 2000)
      
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
                        <IonTitle>Feed & Supplement Livestock</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <IonRefresher slot="fixed" onIonRefresh={RefreshThePage}>
                        <IonRefresherContent></IonRefresherContent>
                    </IonRefresher>
                    {AnimalData?.map((a)=>(
                        <IonCard key={a.id} id={`cards-${a.id}`} onClick={()=>editData(a)}>
                            <IonCardHeader>
                                <IonCardTitle>{a.name}</IonCardTitle>
                                <IonCardSubtitle>{a.breed}</IonCardSubtitle>
                            </IonCardHeader>
                        </IonCard>
                    ))}
               
                    <IonModal isOpen={isOpen} ref={modal} >
                        <IonContent className="ion-padding">
                            <IonTabs>
                                <IonTab tab="viewList">
                                    <div id="viewList-page" className="ion-padding">
                                        <IonRow>
                                            <IonCol className="ion-text-center">
                                                <h3>Foods</h3>
                                            </IonCol>
                                        </IonRow>
                                        
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
                                                    <IonItemOption color="success"><IonIcon slot="icon-only" icon={checkmark} onClick={()=>{DoneSupplement(S.id, S.Feed_Animal_Header)}}></IonIcon></IonItemOption>
                                                    <IonItemOption color="danger" ><IonIcon slot="icon-only" icon={closeOutline} onClick={()=>{ArchiveSupp(S.id, S.Feed_Animal_Header)}}></IonIcon></IonItemOption>
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
                                                    <IonButton className="ion-margin-top" expand="block" onClick={()=>UpdateSupp(supplment, supplmentR, MAlert.id, MAlert.Feed_Animal_Header)}>Update</IonButton>
                                                </IonContent>
                                            </IonModal>
                                       ))}

                                        <IonButton expand="full" className="ion-margin-top" onClick={()=>setIsOpen(false)}>Close</IonButton>
                                    </div>
                                    
                                </IonTab>

                                <IonTab tab="addList">
                                    <div id="addList-page" className="ion-padding">
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
                                                <IonButton expand="full" className="ion-margin-top"onClick={()=>InsertNewFeeds(FAHid, feeds, feedsR)}> ADD </IonButton>
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
                                                <IonButton expand="full" className="ion-margin-top" onClick={()=>InsertNewSupplement(FAHid, supplment, supplmentR)}> ADD </IonButton>
                                            </IonCardContent>
                                            
                                        </IonCard>
                                    </div>
                                   
                                </IonTab>
                                
                                <IonTabBar slot="bottom">
                                    <IonTabButton tab="viewList">
                                        <IonIcon icon={listOutline} />
                                            Lists
                                        </IonTabButton>
                                            <IonTabButton tab="addList">
                                                <IonIcon icon={addOutline} />Add
                                        </IonTabButton> 
                                </IonTabBar>
                            </IonTabs>
                            <IonRow>
                                <IonInput label=""></IonInput>
                            </IonRow>
                           
                        </IonContent>
                    </IonModal>

                   
                </IonContent>
              
            </IonPage>
        </>
    )
}

export default LiveStock_Feed