export default {
    token: "", //Token para fazer conexão com o Discord
    prefix: "", //Prefixo para responder os comandos
    devs: [], // Id's dos users que tem acesso aos comandos de desenvolvedor(R2D2)
    lavalink_nodes: [
        {
            id: "Node", // Indentificação do node
            host: "localhost", // Host do node (String)
            password: "youshallnotpass", // Senha de acesso do node (String)
            port: 2333, // Porta de acesso ao node (Number)
            name: "", // Nome do node (String)
            options: {
                followRedirects: false // Se vai seguir o fluxo de redirecionamento
            }
        }
    ],
    categories: {
        bot: ":space_invader: Bot",
        music: ":musical_note: Música",
        R2D2: ":wrench: Developers(R2D2's)",
        configuration: ":screwdriver: Configuração"
    }
}