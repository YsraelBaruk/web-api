const SUPABASE_URL = "https://aqawtumwlzcipsgfokyr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxYXd0dW13bHpjaXBzZ2Zva3lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NjUzMDIsImV4cCI6MjA3ODA0MTMwMn0.XC9p-M9yt2xrdqD_QcJQ6PFTojOvSBLXNBfcsV2M0QM"; 
const NOME_DA_TABELA = "reviews"; 

(function() {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "id_produto",
            alias: "ID Produto",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "id_avaliacoes",
            alias: "ID Avaliações",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "id_comentario",
            alias: "ID Comentário",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "rating_do_comentario",
            alias: "Rating do Comentário",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "comentario_about_produto",
            alias: "Comentário Sobre Produto",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "sentimento",
            alias: "Sentimento",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "topicos",
            alias: "Tópicos",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "data_coleta",
            alias: "Data da Coleta",
            dataType: tableau.dataTypeEnum.string
        }];

        var tableSchema = {
            id: "supabaseData",
            alias: `Dados da Tabela ${NOME_DA_TABELA}`,
            columns: cols
        };

        schemaCallback([tableSchema]);
    };
    myConnector.getData = async function(table, doneCallback) {
    
        const api_url = `${SUPABASE_URL}/rest/v1/${NOME_DA_TABELA}?select=*`;
        
        console.log("Fetching data from Supabase API:", api_url);
        try {
            const response = await fetch(api_url, {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            });
            console.log(response)
            const respData = await response.json();
            console.log(respData);
            var tableData = [];

            for (var i = 0, len = respData.length; i < len; i++) {
                tableData.push({
                    "id_produto": respData[i].id_produto,
                    "id_avaliacoes": respData[i].id_avaliacoes,
                    "id_comentario": respData[i].id_comentario,
                    "rating_do_comentario": respData[i].rating_do_comentario,
                    "comentario_about_produto": respData[i].comentario_about_produto,
                    "sentimento": respData[i].sentimento,
                    "topicos": respData[i].topicos,
                    "data_coleta": respData[i].data_coleta
                });
            }
            table.appendRows(tableData);
            console.log('Table Data', tableData)
            doneCallback();
        } catch (error) {
            console.error("Erro ao buscar dados do Supabase:", error);
            tableau.abortWithError(error.toString());
        }
    };

    tableau.registerConnector(myConnector);
    tableau.submit();
})();