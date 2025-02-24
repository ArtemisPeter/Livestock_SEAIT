

export const updateAnimalProfile = (animal_id: number, DataTransfer: string, kind: number): any   => {
   
    let feedback;

    if(kind === 1){
        try{
            performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
                const data = await db?.query(`
                        UPDATE Animal Set name = ?
                        WHERE id = ?
                    `, [DataTransfer, animal_id]);

                    if(data){
                        feedback ="success";
                    }else{
                        feedback ="error";
                    }
            })
           }catch(error){
                feedback = "error";
           }
    }
    
};
