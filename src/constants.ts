export interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Stage {
  id: number;
  name: string;
  description: string;
  image: string;
  questions: Question[];
}

export const STAGES: Stage[] = [
  {
    id: 1,
    name: "La\u00A0Serena (Ciudad)",
    description: "Conoce los secretos de la ciudad de los campanarios.",
    image: "https://picsum.photos/seed/flores/1000/600",
    questions: [
      {
        id: 1,
        text: "¿Cuál es el ave protegida del humedal del río Elqui?",
        options: ["Pájaro carpintero", "Pilpilén", "Condorito", "Pájaro cantor"],
        correctIndex: 1,
        explanation: "El Pilpilén es una de las aves más emblemáticas y protegidas de la zona costera y el humedal."
      },
      {
        id: 2,
        text: "¿En qué año fue la primera fundación de La\u00A0Serena?",
        options: ["1549", "1810", "1544", "1900"],
        correctIndex: 2,
        explanation: "Fue fundada por primera vez en 1544 por Juan Bohón, antes de ser destruida y refundada en 1549."
      },
      {
        id: 3,
        text: "¿Quién refundó la ciudad de La\u00A0Serena en 1549?",
        options: ["Pedro de Valdivia", "Diego de Almagro", "Francisco de Aguirre", "Un pirata arrepentido"],
        correctIndex: 2,
        explanation: "Francisco de Aguirre refundó la ciudad tras la destrucción de la primera colonia."
      },
      {
        id: 4,
        text: "¿Cómo se llama el famoso faro que es símbolo de la ciudad?",
        options: ["Faro de Alejandría", "Faro Monumental", "Faro del Fin del Mundo", "Faro de los Deseos"],
        correctIndex: 1,
        explanation: "El Faro Monumental es el ícono indiscutible de la Avenida del Mar."
      },
      {
        id: 5,
        text: "¿Qué pirata atacó e incendió La\u00A0Serena en 1680?",
        options: ["Jack Sparrow", "Francis Drake", "Bartholomew Sharp", "Capitán Garfio"],
        correctIndex: 2,
        explanation: "Bartholomew Sharp lideró el ataque que causó grandes daños a la ciudad colonial."
      }
    ]
  },
  {
    id: 2,
    name: "Historia Precolombina",
    description: "Los antiguos habitantes de los valles transversales.",
    image: "https://picsum.photos/seed/bosque/1000/600",
    questions: [
      {
        id: 1,
        text: "¿Qué cultura precolombina es famosa por su cerámica geométrica en nuestra región?",
        options: ["Molle", "Las Ánimas", "Diaguita", "Chinchorro"],
        correctIndex: 2,
        explanation: "La cultura Diaguita destacó por su avanzada alfarería con diseños geométricos en rojo, blanco y negro."
      },
      {
        id: 2,
        text: "¿Qué cultura introdujo el uso del 'tembetá' (adorno labial) en la zona?",
        options: ["Cultura Diaguita", "Cultura El Molle", "Incas", "Picunches"],
        correctIndex: 1,
        explanation: "La cultura El Molle fue pionera en el uso de adornos labiales de piedra llamados tembetás."
      },
      {
        id: 3,
        text: "¿Qué imperio extendió su influencia hasta el río Choapa antes de la llegada de los españoles?",
        options: ["Imperio Azteca", "Imperio Maya", "Imperio Inca", "Imperio Tiwanaku"],
        correctIndex: 2,
        explanation: "El Imperio Inca dominó gran parte del norte chico, dejando huellas como el Camino del Inca."
      },
      {
        id: 4,
        text: "¿Cómo se llama el sitio arqueológico en Río Hurtado con fósiles de dinosaurios?",
        options: ["Valle del Encanto", "Monumento Natural Pichasca", "Cueva del Milodón", "Punta de Choros"],
        correctIndex: 1,
        explanation: "Pichasca es un sitio clave para entender la paleontología de la región, con restos de Titanosaurios."
      },
      {
        id: 5,
        text: "¿Qué nombre recibe el sitio arqueológico cerca de Ovalle famoso por sus petroglifos?",
        options: ["Valle de la Luna", "Valle del Encanto", "Valle de los Reyes", "Valle de Elqui"],
        correctIndex: 1,
        explanation: "El Valle del Encanto es un Monumento Histórico con impresionantes petroglifos y piedras tacitas."
      }
    ]
  },
  {
    id: 3,
    name: "Historia de Chile",
    description: "Hitos nacionales que marcaron nuestra región.",
    image: "https://picsum.photos/seed/15909596/1000/600",
    questions: [
      {
        id: 1,
        text: "¿Qué presidente chileno, nacido en La\u00A0Serena, impulsó el 'Plan Serena'?",
        options: ["Jorge Alessandri", "Eduardo Frei Montalva", "Gabriel González Videla", "Salvador Allende"],
        correctIndex: 2,
        explanation: "Gabriel González Videla transformó su ciudad natal con un ambicioso plan de modernización arquitectónica."
      },
      {
        id: 2,
        text: "¿En qué año se declaró la Independencia de Chile?",
        options: ["1810", "1818", "1823", "1844"],
        correctIndex: 1,
        explanation: "Aunque la Primera Junta fue en 1810, el Acta de Independencia se firmó en 1818."
      },
      {
        id: 3,
        text: "¿Quién es conocido como el 'Padre de la Patria' en Chile?",
        options: ["José Miguel Carrera", "Bernardo O'Higgins", "Manuel Rodríguez", "Arturo Prat"],
        correctIndex: 1,
        explanation: "Bernardo O'Higgins fue el primer Director Supremo de Chile y figura clave en la independencia."
      },
      {
        id: 4,
        text: "¿Qué batalla consolidó la independencia de Chile en 1818?",
        options: ["Batalla de Chacabuco", "Batalla de Maipú", "Batalla de Rancagua", "Batalla de Concón"],
        correctIndex: 1,
        explanation: "La Batalla de Maipú el 5 de abril de 1818 selló definitivamente la independencia de Chile."
      },
      {
        id: 5,
        text: "¿Quién fue la primera mujer chilena en recibir el Premio Nobel de Literatura?",
        options: ["Isabel Allende", "Marcela Paz", "Gabriela Mistral", "Diamela Eltit"],
        correctIndex: 2,
        explanation: "Gabriela Mistral recibió el Premio Nobel in 1945, siendo la primera latinoamericana en lograrlo."
      }
    ]
  },
  {
    id: 4,
    name: "Historia Universal",
    description: "Grandes hitos de la humanidad.",
    image: "https://picsum.photos/seed/14470693/1000/600",
    questions: [
      {
        id: 1,
        text: "¿En qué año comenzó la Revolución Francesa?",
        options: ["1776", "1789", "1812", "1492"],
        correctIndex: 1,
        explanation: "La Revolución Francesa comenzó en 1789 con la toma de la Bastilla."
      },
      {
        id: 2,
        text: "¿Quién pintó la famosa 'Mona Lisa'?",
        options: ["Miguel Ángel", "Rafael", "Leonardo da Vinci", "Donatello"],
        correctIndex: 2,
        explanation: "Leonardo da Vinci es el genio renacentista detrás de la Gioconda."
      },
      {
        id: 3,
        text: "¿Cuál fue el primer hombre en pisar la Luna?",
        options: ["Buzz Aldrin", "Neil Armstrong", "Yuri Gagarin", "Michael Collins"],
        correctIndex: 1,
        explanation: "Neil Armstrong hizo historia en 1969 con la misión Apolo 11."
      },
      {
        id: 4,
        text: "¿Qué civilización construyó las pirámides de Giza?",
        options: ["Maya", "Egipcia", "Azteca", "Romana"],
        correctIndex: 1,
        explanation: "Los antiguos egipcios construyeron estas maravillas como tumbas para sus faraones."
      },
      {
        id: 5,
        text: "¿En qué continente se originó la humanidad según la ciencia?",
        options: ["Asia", "Europa", "África", "América"],
        correctIndex: 2,
        explanation: "La evidencia fósil y genética sitúa el origen de los primeros humanos en África."
      }
    ]
  },
  {
    id: 5,
    name: "Astronomía y Cielos",
    description: "La\u00A0Serena y Coquimbo: Ventanas al Universo.",
    image: "https://picsum.photos/seed/14467768/1000/600",
    questions: [
      {
        id: 1,
        text: "¿Por qué la Región de Coquimbo es considerada la 'Capital Astronómica del Mundo'?",
        options: ["Por tener más telescopios de juguete", "Por la limpieza de sus cielos", "Porque está más cerca del sol", "Porque no hay nubes nunca"],
        correctIndex: 1,
        explanation: "La baja humedad y escasa contaminación lumínica hacen que sus cielos sean los mejores para la observación científica."
      },
      {
        id: 2,
        text: "¿Qué observatorio internacional se ubica en el cerro Tololo?",
        options: ["VLT (Very Large Telescope)", "ALMA", "CTIO (Cerro Tololo Inter-American Observatory)", "Hubble"],
        correctIndex: 2,
        explanation: "El CTIO es uno de los observatorios científicos más antiguos y productivos del hemisferio sur."
      },
      {
        id: 3,
        text: "¿Cómo se llama el observatorio turístico municipal de Vicuña?",
        options: ["Collowara", "Cruz del Sur", "Mamalluca", "Pangue"],
        correctIndex: 2,
        explanation: "Mamalluca fue el primer observatorio en Chile dedicado exclusivamente al turismo astronómico."
      },
      {
        id: 4,
        text: "¿Qué fenómeno astronómico total ocurrió en la región el 2 de julio de 2019?",
        options: ["Eclipse Lunar", "Eclipse Solar Total", "Lluvia de Estrellas", "Tránsito de Venus"],
        correctIndex: 1,
        explanation: "El eclipse total de sol de 2019 puso a la región en los ojos de todo el mundo."
      },
      {
        id: 5,
        text: "¿Qué constelación es la más buscada por los turistas en los cielos del Elqui?",
        options: ["Osa Mayor", "Casiopea", "Cruz del Sur", "Andrómeda"],
        correctIndex: 2,
        explanation: "La Cruz del Sur es el emblema de los cielos australes y es fácilmente visible desde la región."
      }
    ]
  },
  {
    id: 6,
    name: "Música y Cultura Regional",
    description: "Desde Jorge Peña Hen hasta Los Vikings 5.",
    image: "https://picsum.photos/seed/15113799/1000/600",
    questions: [
      {
        id: 1,
        text: "¿Quién fue el creador de las Orquestas Infantiles en La\u00A0Serena y Chile?",
        options: ["Vicente Bianchi", "Jorge Peña Hen", "Lucho Gatica", "Ángel Parra"],
        correctIndex: 1,
        explanation: "Jorge Peña Hen fue un visionario músico serenense que revolucionó la educación musical en Latinoamérica."
      },
      {
        id: 2,
        text: "¿Qué famosa banda de cumbia es originaria de Coquimbo?",
        options: ["La Sonora de Tommy Rey", "Los Vikings 5", "Chico Trujillo", "Garras de Amor"],
        correctIndex: 1,
        explanation: "Los Vikings 5 son los embajadores de la cumbia coquimbana en todo el mundo."
      },
      {
        id: 3,
        text: "¿Qué instrumento es fundamental en los 'Bailes Chinos' de Andacollo?",
        options: ["Guitarra eléctrica", "Acordeón", "Flauta de madera (Pito)", "Violín"],
        correctIndex: 2,
        explanation: "La flauta de madera o pito produce el sonido característico y ancestral de los Bailes Chinos."
      },
      {
        id: 4,
        text: "¿Cómo se llama el certamen musical que se realiza en Coquimbo durante Fiestas Patrias?",
        options: ["Festival de Viña", "La Pampilla", "Festival de Olmué", "Lollapalooza"],
        correctIndex: 1,
        explanation: "La fiesta de La Pampilla es la celebración de Fiestas Patrias más grande de Chile, con grandes shows musicales."
      },
      {
        id: 5,
        text: "¿Qué compositora y folclorista chilena tiene un museo en su honor en Montegrande?",
        options: ["Violeta Parra", "Margot Loyola", "Gabriela Mistral", "Pascuala Ilabaca"],
        correctIndex: 2,
        explanation: "Aunque es más conocida como poeta, Gabriela Mistral dejó un legado cultural inmenso que incluye la lírica y el folclore."
      }
    ]
  },
  {
    id: 7,
    name: "Mundo Rural y Agricultura",
    description: "El corazón verde de los valles transversales.",
    image: "https://picsum.photos/seed/15003820/1000/600",
    questions: [
      {
        id: 1,
        text: "¿Cuál es el producto estrella de la agricultura en el Valle del Elqui y Limarí?",
        options: ["Manzanas", "Uva (para Pisco y mesa)", "Papas", "Trigo"],
        correctIndex: 1,
        explanation: "La uva es el motor agrícola de la región, destinada tanto a la exportación como a la industria pisquera."
      },
      {
        id: 2,
        text: "¿Qué fruto típico de la zona se utiliza para hacer mermeladas y jugos famosos?",
        options: ["Naranja", "Piña", "Papaya", "Mango"],
        correctIndex: 2,
        explanation: "La Papaya de La\u00A0Serena es un producto con denominación de origen y símbolo de la ciudad."
      },
      {
        id: 3,
        text: "¿Cómo se llama el sistema de riego ancestral que aún se usa en algunos campos?",
        options: ["Aspersión", "Goteo", "Canales de regadío", "Hidroponía"],
        correctIndex: 2,
        explanation: "Los canales de regadío son vitales para llevar el agua de los ríos a las zonas de cultivo en los valles."
      },
      {
        id: 4,
        text: "¿Qué animal es fundamental para la economía rural de las zonas altas (trashumancia)?",
        options: ["Vaca", "Cabra", "Cerdo", "Gallina"],
        correctIndex: 1,
        explanation: "La crianza de cabras y la producción de queso de cabra son pilares de la cultura rural regional."
      },
      {
        id: 5,
        text: "¿Qué embalse en el valle del Elqui es famoso por la práctica de Windsurf y Kitesurf?",
        options: ["Embalse La Paloma", "Embalse Puclaro", "Embalse Recoleta", "Embalse Cogotí"],
        correctIndex: 1,
        explanation: "El Puclaro combina la reserva de agua agrícola con el turismo deportivo de viento."
      }
    ]
  },
  {
    id: 8,
    name: "Leyendas y Misterios",
    description: "La Sirena, brujos y tesoros enterrados.",
    image: "https://picsum.photos/seed/15015030/1000/600",
    questions: [
      {
        id: 1,
        text: "Según la leyenda, ¿qué criatura mitológica habita en la costa de La\u00A0Serena?",
        options: ["El Caleuche", "El Trauco", "La Sirena", "La Pincoya"],
        correctIndex: 2,
        explanation: "La leyenda de la Sirena de La\u00A0Serena es una de las más queridas, asociada a la belleza y el misterio del mar."
      },
      {
        id: 2,
        text: "¿Qué ciudad de la región es conocida como la 'Tierra de Brujos'?",
        options: ["Vicuña", "Salamanca", "Ovalle", "Andacollo"],
        correctIndex: 1,
        explanation: "Salamanca es famosa por sus leyendas sobre aquelarres y la 'Cueva de los Brujos'."
      },
      {
        id: 3,
        text: "¿Qué pirata se dice que enterró un tesoro en la Bahía de Guayacán?",
        options: ["Henry Morgan", "Barbanegra", "Francis Drake", "Capitán Kidd"],
        correctIndex: 2,
        explanation: "Se cuenta que Francis Drake dejó tesoros escondidos en las cuevas de Guayacán."
      },
      {
        id: 4,
        text: "¿Cómo se llama la luz misteriosa que algunos dicen ver en los cerros del Elqui?",
        options: ["Fuego Fatuo", "OVNI", "Luz del Minero", "Estrella Fugaz"],
        correctIndex: 2,
        explanation: "La 'Luz del Minero' es una leyenda común en las zonas de tradición minera de la región."
      },
      {
        id: 5,
        text: "¿Qué cerro de La\u00A0Serena tiene leyendas sobre portales a otras dimensiones?",
        options: ["Cerro Tololo", "Cerro Grande", "Cerro Mamalluca", "Cerro Las Campanas"],
        correctIndex: 1,
        explanation: "El Cerro Grande es centro de muchas historias sobre avistamientos y fenómenos inexplicables."
      }
    ]
  },
  {
    id: 9,
    name: "Comuna de Coquimbo",
    description: "Tierra de piratas y tesoros marinos.",
    image: "https://picsum.photos/seed/15344476/1000/600",
    questions: [
      {
        id: 1,
        text: "¿Cómo se llama la famosa cruz que domina el paisaje de Coquimbo?",
        options: ["Cruz de Mayo", "Cruz del Tercer Milenio", "Cruz del Sur", "Cruz de los Piratas"],
        correctIndex: 1,
        explanation: "La Cruz del Tercer Milenio es un monumento religioso y turístico icónico de la ciudad puerto."
      },
      {
        id: 2,
        text: "¿Qué mezquita es un símbolo de la hermandad cultural en Coquimbo?",
        options: ["Mezquita de Al-Aqsa", "Mezquita de Coquimbo (Centro Mohammed VI)", "Mezquita Azul", "Mezquita de Córdoba"],
        correctIndex: 1,
        explanation: "La Mezquita de Coquimbo es un centro cultural y religioso único en Sudamérica."
      },
      {
        id: 3,
        text: "¿Cómo se llama el barrio histórico de Coquimbo famoso por su arquitectura inglesa?",
        options: ["Barrio Cívico", "Barrio Inglés", "Barrio Universitario", "Barrio Industrial"],
        correctIndex: 1,
        explanation: "El Barrio Inglés conserva la arquitectura de la época de oro del puerto."
      }
    ]
  },
  {
    id: 10,
    name: "Comuna de Andacollo",
    description: "Montaña mágica y fe inquebrantable.",
    image: "https://picsum.photos/seed/15187092/1000/600",
    questions: [
      {
        id: 1,
        text: "¿A qué virgen se rinde culto en la famosa fiesta de Andacollo?",
        options: ["Virgen del Carmen", "Virgen del Rosario", "Virgen de la Tirana", "Virgen de Guadalupe"],
        correctIndex: 1,
        explanation: "La Virgen del Rosario de Andacollo atrae a miles de peregrinos y bailes chinos cada año."
      },
      {
        id: 2,
        text: "¿Qué actividad económica ha sido histórica en Andacollo?",
        options: ["Pesca", "Minería (Oro)", "Agricultura de secano", "Turismo de nieve"],
        correctIndex: 1,
        explanation: "Andacollo tiene una milenaria tradición de minería de oro, desde tiempos prehispánicos."
      },
      {
        id: 3,
        text: "¿Cómo se llaman los grupos de baile religioso que participan en la fiesta de Andacollo?",
        options: ["Diabladas", "Bailes Chinos", "Tinkus", "Caporales"],
        correctIndex: 1,
        explanation: "Los Bailes Chinos son Patrimonio Cultural Inmaterial de la Humanidad y son el alma de la fiesta de Andacollo."
      }
    ]
  },
  {
    id: 11,
    name: "Comuna de Vicuña",
    description: "Cuna de la poesía y el pisco.",
    image: "https://picsum.photos/seed/15165947/1000/600",
    questions: [
      {
        id: 1,
        text: "¿Qué famosa torre se encuentra en la plaza de Vicuña?",
        options: ["Torre Eiffel", "Torre Bauer", "Torre de Pisa", "Torre del Reloj"],
        correctIndex: 1,
        explanation: "La Torre Bauer es un símbolo arquitectónico de Vicuña, traída desde Alemania por el alcalde Bauer."
      },
      {
        id: 2,
        text: "¿En qué año nació Gabriela Mistral en Vicuña?",
        options: ["1900", "1889", "1810", "1945"],
        correctIndex: 1,
        explanation: "Lucila Godoy Alcayaga, Gabriela Mistral, nació el 7 de abril de 1889."
      },
      {
        id: 3,
        text: "¿Qué destilería de pisco, una de las más antiguas, se puede visitar en Vicuña?",
        options: ["Pisco Mistral", "Pisco Capel", "Pisco Aba", "Pisco Los Nichos"],
        correctIndex: 1,
        explanation: "La planta de Pisco Capel es un centro turístico importante en la entrada de Vicuña."
      }
    ]
  },
  {
    id: 12,
    name: "Comuna de La Higuera",
    description: "Portal norte y hogar de los pingüinos.",
    image: "https://picsum.photos/seed/15899092/1000/600",
    questions: [
      {
        id: 1,
        text: "¿Qué reserva nacional se encuentra en la costa de La Higuera?",
        options: ["Reserva de la Biosfera", "Reserva Pingüino de Humboldt", "Parque Fray Jorge", "Reserva Las Chinchillas"],
        correctIndex: 1,
        explanation: "La Reserva Nacional Pingüino de Humboldt es famosa por su biodiversidad marina."
      },
      {
        id: 2,
        text: "¿Qué localidad de La Higuera es el punto de partida para visitar Isla Damas?",
        options: ["Caleta Hornos", "Punta de Choros", "Chañaral de Aceituno", "Los Choros"],
        correctIndex: 1,
        explanation: "Punta de Choros es el principal puerto de embarque para los tours a la reserva nacional."
      },
      {
        id: 3,
        text: "¿Qué importante observatorio científico se ubica en la comuna de La Higuera?",
        options: ["Cerro Tololo", "Observatorio Las Campanas", "La Silla", "Gemini Sur"],
        correctIndex: 1,
        explanation: "Las Campanas es un observatorio de clase mundial ubicado en el límite norte de la región."
      }
    ]
  },
  {
    id: 13,
    name: "Comuna de Paihuano",
    description: "Tierra mágica en el corazón del Elqui.",
    image: "https://picsum.photos/seed/15187092/1000/600",
    questions: [
      {
        id: 1,
        text: "¿En qué localidad de Paihuano se encuentra el mausoleo de Gabriela Mistral?",
        options: ["Pisco Elqui", "Montegrande", "Alcohuaz", "Horcón"],
        correctIndex: 1,
        explanation: "Gabriela Mistral está sepultada en Montegrande, como fue su deseo."
      },
      {
        id: 2,
        text: "¿Cómo se llamaba antiguamente la localidad de Pisco Elqui?",
        options: ["Paihuano", "La Unión", "Montegrande", "Alcohuaz"],
        correctIndex: 1,
        explanation: "Pisco Elqui se llamaba 'La Unión' hasta que fue renombrado para potenciar la denominación de origen del pisco."
      },
      {
        id: 3,
        text: "¿Qué pueblo de Paihuano es famoso por sus artesanías y su ambiente místico?",
        options: ["Paihuano", "Horcón", "Montegrande", "Cochiguaz"],
        correctIndex: 1,
        explanation: "Horcón y Cochiguaz son conocidos por su belleza natural y su conexión con lo espiritual."
      }
    ]
  },
  {
    id: 14,
    name: "Comuna de Ovalle",
    description: "Capital del Limarí y corazón agrícola.",
    image: "https://picsum.photos/seed/15003820/1000/600",
    questions: [
      {
        id: 1,
        text: "¿Cómo se llama la feria más importante de Ovalle?",
        options: ["Feria Libre", "Feria Modelo", "Mercado Central", "Feria de Abastos"],
        correctIndex: 1,
        explanation: "La Feria Modelo de Ovalle es el centro de comercio agrícola más grande de la zona."
      },
      {
        id: 2,
        text: "¿Qué parque nacional, famoso por su bosque hidrófilo, está cerca de Ovalle?",
        options: ["Parque Nacional Llanos de Challe", "Parque Nacional Fray Jorge", "Parque Nacional Pan de Azúcar", "Parque Nacional La Campana"],
        correctIndex: 1,
        explanation: "Fray Jorge es un bosque valdiviano en medio del desierto, gracias a la camanchaca."
      },
      {
        id: 3,
        text: "¿Qué importante museo arqueológico se encuentra en Ovalle?",
        options: ["Museo Histórico Gabriel González Videla", "Museo del Limarí", "Museo Arqueológico de La\u00A0Serena", "Museo Gabriela Mistral"],
        correctIndex: 1,
        explanation: "El Museo del Limarí alberga una de las colecciones de cerámica Diaguita más importantes del país."
      }
    ]
  },
  {
    id: 15,
    name: "Comuna de Monte Patria",
    description: "Valles generosos y uvas de exportación.",
    image: "https://picsum.photos/seed/15165947/1000/600",
    questions: [
      {
        id: 1,
        text: "¿Qué embalse es el más grande de la región y se ubica en Monte Patria?",
        options: ["Embalse Recoleta", "Embalse La Paloma", "Embalse Cogotí", "Embalse Puclaro"],
        correctIndex: 1,
        explanation: "La Paloma es uno de los embalses más grandes de Sudamérica para riego agrícola."
      },
      {
        id: 2,
        text: "¿Cuántos valles principales convergen en la comuna de Monte Patria?",
        options: ["3 valles", "5 valles", "2 valles", "7 valles"],
        correctIndex: 1,
        explanation: "Monte Patria es conocida como la comuna de los 5 valles: Grande, Rapel, Mostazal, Huatulame y Limarí."
      },
      {
        id: 3,
        text: "¿Qué fruto seco es una producción destacada de Monte Patria?",
        options: ["Almendra", "Nuez", "Avellana", "Castaña"],
        correctIndex: 1,
        explanation: "La producción de nueces de alta calidad es un pilar económico de la comuna."
      }
    ]
  },
  {
    id: 16,
    name: "Comuna de Punitaqui",
    description: "Tierra de molinos y tradiciones.",
    image: "https://picsum.photos/seed/15003820/1000/600",
    questions: [
      {
        id: 1,
        text: "¿Por qué es conocida Punitaqui en el ámbito energético?",
        options: ["Centrales Hidroeléctricas", "Parques Eólicos", "Paneles Solares", "Geotermia"],
        correctIndex: 1,
        explanation: "Punitaqui cuenta con importantes parques eólicos que aprovechan los vientos de la zona."
      },
      {
        id: 2,
        text: "¿Qué producto típico de Punitaqui es famoso por su sabor artesanal?",
        options: ["Vino", "Queso de Cabra", "Aceite de Oliva", "Miel"],
        correctIndex: 1,
        explanation: "El queso de cabra de Punitaqui es reconocido por su tradición y calidad."
      },
      {
        id: 3,
        text: "¿Qué mineral fue históricamente importante en la mina 'El Quereo' de Punitaqui?",
        options: ["Oro", "Mercurio", "Cobre", "Hierro"],
        correctIndex: 1,
        explanation: "Punitaqui tuvo una de las pocas minas de mercurio en Chile."
      }
    ]
  },
  {
    id: 17,
    name: "Comuna de Combarbalá",
    description: "Cielo limpio y piedra única.",
    image: "https://picsum.photos/seed/14467768/1000/600",
    questions: [
      {
        id: 1,
        text: "¿Cómo se llama la piedra única en el mundo que se extrae en esta comuna?",
        options: ["Lapislázuli", "Combarbalita", "Obsidiana", "Mármol"],
        correctIndex: 1,
        explanation: "La Combarbalita es una roca ornamental única que solo se encuentra en Combarbalá."
      },
      {
        id: 2,
        text: "¿Qué observatorio turístico destaca en Combarbalá?",
        options: ["Mamalluca", "Cruz del Sur", "Collowara", "Pangue"],
        correctIndex: 1,
        explanation: "El Observatorio Cruz del Sur es uno de los más grandes y modernos para astroturismo."
      },
      {
        id: 3,
        text: "¿Qué artesanía es la más representativa de Combarbalá?",
        options: ["Tejido en lana", "Talla en Combarbalita", "Alfarería Diaguita", "Orfebrería en plata"],
        correctIndex: 1,
        explanation: "Los artesanos de Combarbalá son maestros en tallar figuras y objetos en la piedra local."
      }
    ]
  },
  {
    id: 18,
    name: "Comuna de Río Hurtado",
    description: "Tierra de dinosaurios y fósiles.",
    image: "https://picsum.photos/seed/15187092/1000/600",
    questions: [
      {
        id: 1,
        text: "¿Qué importante hallazgo paleontológico se hizo en Río Hurtado?",
        options: ["Tiranosaurio", "Titanosaurio", "Mamut", "Trilobite"],
        correctIndex: 1,
        explanation: "En el Monumento Natural Pichasca se han encontrado restos de Titanosaurios."
      },
      {
        id: 2,
        text: "¿Cómo se llama el sendero que recorre los hallazgos en Pichasca?",
        options: ["Ruta del Sol", "Sendero de los Dinosaurios", "Camino del Inca", "Sendero del Tiempo"],
        correctIndex: 1,
        explanation: "El sendero permite ver réplicas de dinosaurios y restos de troncos petrificados."
      },
      {
        id: 3,
        text: "¿Qué cultura precolombina dejó importantes vestigios en Río Hurtado?",
        options: ["Cultura Diaguita", "Cultura El Molle", "Incas", "Mapuches"],
        correctIndex: 1,
        explanation: "La zona fue un asentamiento clave para la cultura El Molle."
      }
    ]
  },
  {
    id: 19,
    name: "Comuna de Illapel",
    description: "Capital del Choapa y ciudad de los cerros.",
    image: "https://picsum.photos/seed/15165947/1000/600",
    questions: [
      {
        id: 1,
        text: "¿Qué reserva nacional protege a la chinchilla en Illapel?",
        options: ["Reserva El Yali", "Reserva Las Chinchillas", "Parque Fray Jorge", "Reserva Los Flamencos"],
        correctIndex: 1,
        explanation: "La Reserva Nacional Las Chinchillas protege a esta especie en su hábitat natural."
      },
      {
        id: 2,
        text: "¿Cómo se llama el río que atraviesa la ciudad de Illapel?",
        options: ["Río Choapa", "Río Elqui", "Río Illapel", "Río Limarí"],
        correctIndex: 2,
        explanation: "El río Illapel es the principal curso de agua que baña la capital de la provincia del Choapa."
      },
      {
        id: 3,
        text: "¿Qué cerro es el mirador natural más importante de Illapel?",
        options: ["Cerro Grande", "Cerro La Virgen", "Cerro El Plomo", "Cerro Santa Lucía"],
        correctIndex: 1,
        explanation: "Desde el Cerro La Virgen se tiene una vista panorámica de toda la ciudad y el valle."
      }
    ]
  },
  {
    id: 20,
    name: "Comuna de Los Vilos",
    description: "Puerta de entrada sur y sabor a mar.",
    image: "https://picsum.photos/seed/15344476/1000/600",
    questions: [
      {
        id: 1,
        text: "¿Cómo se llama la playa más famosa de Los Vilos?",
        options: ["Pichidangui", "Playa Principal", "Totoralillo", "La Herradura"],
        correctIndex: 1,
        explanation: "La playa principal de Los Vilos es un gran atractivo turístico de la provincia."
      },
      {
        id: 2,
        text: "¿Qué balneario de la comuna es famoso por su bahía en forma de herradura y su iglesia de piedra?",
        options: ["Quilimarí", "Pichidangui", "Los Vilos", "Caimanes"],
        correctIndex: 1,
        explanation: "Pichidangui es uno de los balnearios más hermosos y visitados del norte chico."
      },
      {
        id: 3,
        text: "¿Qué importante puerto minero se ubica cerca de Los Vilos?",
        options: ["Puerto Coquimbo", "Puerto Punta Chungo", "Puerto Guayacán", "Puerto Totoralillo"],
        correctIndex: 1,
        explanation: "Punta Chungo es el terminal marítimo de Minera Los Pelambres."
      }
    ]
  },
  {
    id: 21,
    name: "Gran Final Regional",
    description: "El desafío definitivo para el verdadero Hijo Ilustre.",
    image: "https://picsum.photos/seed/15899092/1000/600",
    questions: [
      {
        id: 1,
        text: "¿Cuál es la superficie aproximada de la Región de Coquimbo?",
        options: ["20.000 km²", "40.000 km²", "60.000 km²", "10.000 km²"],
        correctIndex: 1,
        explanation: "La región tiene una superficie de aproximadamente 40.580 km²."
      },
      {
        id: 2,
        text: "¿Cuántas provincias componen la Región de Coquimbo?",
        options: ["2 provincias", "3 provincias", "4 provincias", "5 provincias"],
        correctIndex: 1,
        explanation: "La región se divide en las provincias de Elqui, Limarí y Choapa."
      },
      {
        id: 3,
        text: "¿Cuál es la capital regional de Coquimbo?",
        options: ["Coquimbo", "La\u00A0Serena", "Ovalle", "Illapel"],
        correctIndex: 1,
        explanation: "La\u00A0Serena es la capital de la región y sede de la Delegación Presidencial."
      },
      {
        id: 4,
        text: "¿Qué cordillera marca el límite oriental de nuestra región?",
        options: ["Cordillera de la Costa", "Cordillera de los Andes", "Cordillera de Domeyko", "Cordillera de los Pincheira"],
        correctIndex: 1,
        explanation: "Los Andes se imponen con altas cumbres que separan a Chile de Argentina."
      },
      {
        id: 5,
        text: "¿Cómo se llama el paso fronterizo que une la región con San Juan, Argentina?",
        options: ["Paso Los Libertadores", "Paso Agua Negra", "Paso Pehuenche", "Paso Jama"],
        correctIndex: 1,
        explanation: "El Paso Agua Negra es la conexión internacional vital para el corredor bioceánico."
      }
    ]
  },
  {
    id: 22,
    name: "Fútbol: Pasión de Multitudes",
    description: "Desde el Clásico Regional hasta la Selección Chilena.",
    image: "https://picsum.photos/seed/15746298/1000/600",
    questions: [
      {
        id: 1,
        text: "¿Cómo se llama el clásico partido entre Coquimbo Unido y Club Deportes La\u00A0Serena?",
        options: ["Clásico del Norte", "Clásico de la Cuarta Región", "Clásico Universitario", "Clásico del Puerto"],
        correctIndex: 1,
        explanation: "Es uno de los clásicos más apasionantes y antiguos del fútbol chileno."
      },
      {
        id: 2,
        text: "¿En qué año Club Deportes La\u00A0Serena ganó su única Copa Chile?",
        options: ["1950", "1960", "1970", "1980"],
        correctIndex: 1,
        explanation: "CD La\u00A0Serena se coronó campeón de la Copa Chile en 1960."
      },
      {
        id: 3,
        text: "¿Cómo se le conoce popularmente al equipo de Coquimbo Unido?",
        options: ["El Granate", "El Pirata", "El Papayero", "El Minero"],
        correctIndex: 1,
        explanation: "Debido a su historia portuaria, Coquimbo Unido es 'El Pirata'."
      },
      {
        id: 4,
        text: "¿Qué jugador serenense fue goleador histórico y figura en Colo-Colo y la Selección?",
        options: ["Carlos Caszely", "Franklin Lobos", "Marcelo Salas", "Iván Zamorano"],
        correctIndex: 1,
        explanation: "Franklin Lobos es un referente histórico, aunque la región ha dado muchos talentos al fútbol nacional."
      },
      {
        id: 5,
        text: "¿En qué mundial Chile obtuvo el tercer lugar?",
        options: ["Francia 1998", "Chile 1962", "Sudáfrica 2010", "Brasil 2014"],
        correctIndex: 1,
        explanation: "El mayor logro del fútbol chileno masculino fue el tercer lugar en el mundial organizado en casa en 1962."
      }
    ]
  },
  {
    id: 23,
    name: "Tenis y Logros Deportivos",
    description: "Hazañas que hicieron vibrar a todo un país.",
    image: "https://picsum.photos/seed/15954359/1000/600",
    questions: [
      {
        id: 1,
        text: "¿Quiénes ganaron las primeras medallas de oro olímpicas para Chile en Atenas 2004?",
        options: ["Marcelo Ríos", "Nicolás Massú y Fernando González", "Arturo Prat", "Kristel Köbrich"],
        correctIndex: 1,
        explanation: "Massú y González lograron la hazaña histórica en singles y dobles."
      },
      {
        id: 2,
        text: "¿Qué tenista chileno fue el primer latinoamericano en ser N°1 del mundo (ATP)?",
        options: ["Nicolás Massú", "Marcelo Ríos", "Fernando González", "Hans Gildemeister"],
        correctIndex: 1,
        explanation: "El 'Chino' Ríos alcanzó la cima del tenis mundial en marzo de 1998."
      },
      {
        id: 3,
        text: "¿En qué ciudad de la región se han realizado importantes torneos Challenger de Tenis?",
        options: ["Coquimbo", "La\u00A0Serena", "Ovalle", "Vicuña"],
        correctIndex: 1,
        explanation: "La\u00A0Serena y Coquimbo han sido sedes constantes de torneos profesionales de la ATP."
      },
      {
        id: 4,
        text: "¿Qué deportista chilena es múltiple medallista en natación y referente mundial?",
        options: ["Bárbara Riveros", "Kristel Köbrich", "Francisca Crovetto", "Natalia Duco"],
        correctIndex: 1,
        explanation: "Kristel Köbrich es la máxima exponente de la natación chilena en la historia."
      },
      {
        id: 5,
        text: "¿Quién ganó la medalla de oro en Tiro al Vuelo en los Juegos Olímpicos de París 2024?",
        options: ["Yasmani Acosta", "Francisca Crovetto", "Fernando González", "Marlene Ahrens"],
        correctIndex: 1,
        explanation: "Francisca Crovetto hizo historia al ganar el oro olímpico en París 2024."
      }
    ]
  },
  {
    id: 24,
    name: "Gastronomía y Sabores",
    description: "Un festín para el paladar entre mar y cordillera.",
    image: "https://picsum.photos/seed/15046749/1000/600",
    questions: [
      {
        id: 1,
        text: "¿Cuál es el postre típico de La\u00A0Serena hecho con una fruta local?",
        options: ["Leche asada", "Papayas al jugo", "Mote con huesillo", "Arroz con leche"],
        correctIndex: 1,
        explanation: "Las papayas al jugo son el dulce emblema de la ciudad."
      },
      {
        id: 2,
        text: "¿Qué preparación marina es un clásico de la Caleta de Coquimbo?",
        options: ["Ceviche de Salmón", "Churrasco Marino", "Paella", "Sushi de Reineta"],
        correctIndex: 1,
        explanation: "El churrasco marino (sándwich de pescado frito) es la estrella de la gastronomía portuaria."
      },
      {
        id: 3,
        text: "¿Qué queso es famoso por su producción artesanal en el Limarí?",
        options: ["Queso Mantecoso", "Queso de Cabra", "Queso Azul", "Queso Fresco"],
        correctIndex: 1,
        explanation: "El queso de cabra de Ovalle y alrededores es reconocido por su sabor intenso y tradicional."
      }
    ]
  },
  {
    id: 25,
    name: "Arquitectura y Patrimonio",
    description: "La huella del tiempo en nuestras calles.",
    image: "https://picsum.photos/seed/15187806/1000/600",
    questions: [
      {
        id: 1,
        text: "¿Qué estilo arquitectónico predomina en el casco histórico de La\u00A0Serena gracias al Plan Serena?",
        options: ["Gótico", "Neocolonial", "Barroco", "Modernista"],
        correctIndex: 1,
        explanation: "El estilo neocolonial le da a La\u00A0Serena su identidad visual única y armoniosa."
      },
      {
        id: 2,
        text: "¿Cómo se llama la iglesia de piedra caliza más antigua de La\u00A0Serena?",
        options: ["Catedral de La\u00A0Serena", "Iglesia de San Francisco", "Iglesia de Santo Domingo", "Iglesia de La Merced"],
        correctIndex: 1,
        explanation: "La Iglesia de San Francisco es Monumento Nacional y una de las más antiguas del país."
      },
      {
        id: 3,
        text: "¿Qué famoso arquitecto diseñó la Cruz del Tercer Milenio en Coquimbo?",
        options: ["Luciano Kulczewski", "Carlos Casanueva", "Joaquín Toesca", "Juan Pablo II"],
        correctIndex: 1,
        explanation: "Fue diseñada por el arquitecto Carlos Casanueva Opazo."
      }
    ]
  },
  {
    id: 26,
    name: "Maravillas del Mundo",
    description: "Viaja por los tesoros de la humanidad.",
    image: "https://picsum.photos/seed/15008355/1000/600",
    questions: [
      {
        id: 1,
        text: "¿En qué país se encuentra la ciudad perdida de Petra?",
        options: ["Egipto", "Jordania", "Irak", "Turquía"],
        correctIndex: 1,
        explanation: "Petra es una ciudad histórica y arqueológica en el sur de Jordania."
      },
      {
        id: 2,
        text: "¿Cuál es la muralla más larga del mundo?",
        options: ["Muralla de Adriano", "Gran Muralla China", "Muralla de Berlín", "Muralla de Ávila"],
        correctIndex: 1,
        explanation: "La Gran Muralla China se extiende por miles de kilómetros."
      },
      {
        id: 3,
        text: "¿Qué monumento de la India fue construido por amor?",
        options: ["Fuerte Rojo", "Taj Mahal", "Puerta de la India", "Templo del Loto"],
        correctIndex: 1,
        explanation: "El Taj Mahal fue construido por el emperador Shah Jahan en memoria de su esposa."
      }
    ]
  },
  {
    id: 27,
    name: "Inventos y Ciencia",
    description: "Descubrimientos que cambiaron el rumbo de la historia.",
    image: "https://picsum.photos/seed/15074132/1000/600",
    questions: [
      {
        id: 1,
        text: "¿Quién es considerado el inventor de la bombilla eléctrica?",
        options: ["Nikola Tesla", "Thomas Edison", "Alexander Graham Bell", "Isaac Newton"],
        correctIndex: 1,
        explanation: "Edison perfeccionó y comercializó la primera bombilla incandescente viable."
      },
      {
        id: 2,
        text: "¿Qué científico formuló la teoría de la relatividad?",
        options: ["Stephen Hawking", "Albert Einstein", "Marie Curie", "Charles Darwin"],
        correctIndex: 1,
        explanation: "Einstein revolucionó la física con su famosa ecuación E=mc²."
      },
      {
        id: 3,
        text: "¿Quién descubrió la penicilina?",
        options: ["Louis Pasteur", "Alexander Fleming", "Gregor Mendel", "Robert Koch"],
        correctIndex: 1,
        explanation: "Fleming descubrió el primer antibiótico en 1928, salvando millones de vidas."
      }
    ]
  },
  {
    id: 28,
    name: "Chile: Paisajes y Naturaleza",
    description: "Desde el desierto más árido hasta los glaciares del sur.",
    image: "https://picsum.photos/seed/15164966/1000/600",
    questions: [
      {
        id: 1,
        text: "¿Cuál es el desierto más árido del mundo, ubicado en el norte de Chile?",
        options: ["Desierto del Sahara", "Desierto de Atacama", "Desierto de Gobi", "Desierto de Sonora"],
        correctIndex: 1,
        explanation: "El Desierto de Atacama es conocido mundialmente por su extrema aridez."
      },
      {
        id: 2,
        text: "¿Cómo se llama el parque nacional famoso por sus 'Torres' en la Patagonia?",
        options: ["Vicente Pérez Rosales", "Torres del Paine", "Conguillío", "Lauca"],
        correctIndex: 1,
        explanation: "Torres del Paine es uno de los destinos turísticos más importantes de Chile."
      },
      {
        id: 3,
        text: "¿Qué volcán es considerado uno de los más activos de Sudamérica?",
        options: ["Osorno", "Villarrica", "Llaima", "Calbuco"],
        correctIndex: 1,
        explanation: "El volcán Villarrica es conocido por su constante actividad y su cráter abierto."
      }
    ]
  },
  {
    id: 29,
    name: "Chile: Literatura y Arte",
    description: "Nuestros grandes maestros de las letras y el pincel.",
    image: "https://picsum.photos/seed/14565130/1000/600",
    questions: [
      {
        id: 1,
        text: "¿Qué poeta chileno ganó el Premio Nobel de Literatura en 1971?",
        options: ["Gabriela Mistral", "Pablo Neruda", "Nicanor Parra", "Vicente Huidobro"],
        correctIndex: 1,
        explanation: "Pablo Neruda es uno de los poetas más influyentes del siglo XX."
      },
      {
        id: 2,
        text: "¿Quién fue la primera mujer latinoamericana en ganar el Nobel de Literatura?",
        options: ["Isabel Allende", "Gabriela Mistral", "Violeta Parra", "Marcela Paz"],
        correctIndex: 1,
        explanation: "Nuestra elquina Gabriela Mistral recibió el galardón en 1945."
      },
      {
        id: 3,
        text: "¿Qué artista chilena es la autora de 'Gracias a la vida'?",
        options: ["Myriam Hernández", "Violeta Parra", "Mon Laferte", "Javiera Mena"],
        correctIndex: 1,
        explanation: "Violeta Parra fue una folclorista, artista y compositora fundamental."
      }
    ]
  },
  {
    id: 30,
    name: "Grandes Civilizaciones",
    description: "Los imperios que forjaron el mundo antiguo.",
    image: "https://picsum.photos/seed/15187092/1000/600",
    questions: [
      {
        id: 1,
        text: "¿Qué civilización construyó las pirámides de Giza?",
        options: ["Maya", "Egipcia", "Azteca", "Romana"],
        correctIndex: 1,
        explanation: "Los antiguos egipcios construyeron estas maravillas como tumbas reales."
      },
      {
        id: 2,
        text: "¿En qué ciudad se encontraba el famoso Coliseo?",
        options: ["Atenas", "Roma", "Cartago", "Constantinopla"],
        correctIndex: 1,
        explanation: "El Coliseo es el anfiteatro más grande construido durante el Imperio Romano."
      },
      {
        id: 3,
        text: "¿Qué cultura inventó la democracia?",
        options: ["Fenicia", "Griega", "Persa", "Etrusca"],
        correctIndex: 1,
        explanation: "Atenas es considerada la cuna de la democracia occidental."
      }
    ]
  },
  {
    id: 31,
    name: "Geografía Extrema",
    description: "Récords y curiosidades de nuestro planeta.",
    image: "https://picsum.photos/seed/14648227/1000/600",
    questions: [
      {
        id: 1,
        text: "¿Cuál es la montaña más alta del mundo sobre el nivel del mar?",
        options: ["K2", "Monte Everest", "Aconcagua", "Kilimanjaro"],
        correctIndex: 1,
        explanation: "El Everest se eleva a 8.848 metros en la cordillera del Himalaya."
      },
      {
        id: 2,
        text: "¿Cuál es el río más largo del mundo?",
        options: ["Nilo", "Amazonas", "Misisipi", "Yangtsé"],
        correctIndex: 1,
        explanation: "El Amazonas es el río más largo y caudaloso de la Tierra."
      },
      {
        id: 3,
        text: "¿Cuál es el océano más grande del planeta?",
        options: ["Atlántico", "Pacífico", "Índico", "Ártico"],
        correctIndex: 1,
        explanation: "El Océano Pacífico cubre más de un tercio de la superficie terrestre."
      }
    ]
  },
  {
    id: 32,
    name: "Oficios Tradicionales y Saberes",
    description: "Honrando a quienes mantienen vivas nuestras tradiciones.",
    image: "https://picsum.photos/seed/15135192/1000/600",
    questions: [
      {
        id: 1,
        text: "¿Qué oficio tradicional utiliza la piedra combarbalita para crear artesanías únicas?",
        options: ["Cantero de Coquimbo", "Artesano de Combarbalá", "Alfarero de Elqui", "Tejedor de Illapel"],
        correctIndex: 1,
        explanation: "La combarbalita es una piedra semipreciosa única en el mundo, trabajada por artesanos locales."
      },
      {
        id: 2,
        text: "¿Cómo se les llama a los pastores que trasladan su ganado a la cordillera en verano?",
        options: ["Arrieros", "Crianceros", "Vaqueros", "Ovejeros"],
        correctIndex: 1,
        explanation: "La trashumancia es una práctica ancestral de los crianceros de la región."
      },
      {
        id: 3,
        text: "¿Qué material es la base de la cestería tradicional en la zona de Chimba y alrededores?",
        options: ["Mimbre", "Totora", "Lana", "Cuero"],
        correctIndex: 1,
        explanation: "La totora es fundamental para la cestería y artesanía tradicional de la zona."
      }
    ]
  }
];

export const PRIZES = [
  { level: "Nivel 1", title: "Conocedor Inicial", reward: "1 Ficha VLS" },
  { level: "Nivel 2", title: "Vecino Observador", reward: "2 Fichas VLS" },
  { level: "Nivel 3", title: "Historiador Nacional", reward: "3 Fichas VLS" },
  { level: "Nivel 4", title: "Ciudadano del Mundo", reward: "4 Fichas VLS" },
  { level: "Nivel 5", title: "Explorador del Cosmos", reward: "5 Fichas VLS" },
  { level: "Nivel 6", title: "Guía Cultural", reward: "6 Fichas VLS" },
  { level: "Nivel 7", title: "Maestro Rural", reward: "7 Fichas VLS" },
  { level: "Nivel 8", title: "Guardián de Leyendas", reward: "8 Fichas VLS" },
  { level: "Nivel 9", title: "Embajador del Puerto", reward: "9 Fichas VLS" },
  { level: "Nivel 10", title: "Peregrino de la Fe", reward: "10 Fichas VLS" },
  { level: "Nivel 11", title: "Místico del Elqui", reward: "11 Fichas VLS" },
  { level: "Nivel 12", title: "Protector del Humboldt", reward: "12 Fichas VLS" },
  { level: "Nivel 13", title: "Hijo del Valle Mágico", reward: "13 Fichas VLS" },
  { level: "Nivel 14", title: "Corazón del Limarí", reward: "14 Fichas VLS" },
  { level: "Nivel 15", title: "Señor de los Valles", reward: "15 Fichas VLS" },
  { level: "Nivel 16", title: "Viento de Punitaqui", reward: "16 Fichas VLS" },
  { level: "Nivel 17", title: "Artesano de Combarbalá", reward: "17 Fichas VLS" },
  { level: "Nivel 18", title: "Cazador de Dinosaurios", reward: "18 Fichas VLS" },
  { level: "Nivel 19", title: "Guardián del Choapa", reward: "19 Fichas VLS" },
  { level: "Nivel 20", title: "Navegante de Los Vilos", reward: "20 Fichas VLS" },
  { level: "Nivel 21", title: "Hijo Ilustre Regional", reward: "21 Fichas VLS" },
  { level: "Nivel 22", title: "Goleador del Elqui", reward: "22 Fichas VLS" },
  { level: "Nivel 23", title: "Campeón Olímpico", reward: "23 Fichas VLS" },
  { level: "Nivel 24", title: "Gourmet del Norte", reward: "24 Fichas VLS" },
  { level: "Nivel 25", title: "Patrimonio Viviente", reward: "25 Fichas VLS" },
  { level: "Nivel 26", title: "Viajero Universal", reward: "26 Fichas VLS" },
  { level: "Nivel 27", title: "Genio de la Humanidad", reward: "27 Fichas VLS" },
  { level: "Nivel 28", title: "Explorador de Cumbres", reward: "28 Fichas VLS" },
  { level: "Nivel 29", title: "Maestro de las Letras", reward: "29 Fichas VLS" },
  { level: "Nivel 30", title: "Sabio de la Antigüedad", reward: "30 Fichas VLS" },
  { level: "Nivel 31", title: "Conquistador del Mundo", reward: "31 Fichas VLS" },
  { level: "Nivel 32", title: "Maestro de Oficios", reward: "32 Fichas VLS Reales" }
];

export const QUESTION_PRIZES = [
  { level: 1, reward: "100 Puntos" },
  { level: 2, reward: "200 Puntos" },
  { level: 3, reward: "300 Puntos" },
  { level: 4, reward: "500 Puntos" },
  { level: 5, reward: "1.000 Puntos (SEGURO)" },
  { level: 6, reward: "2.000 Puntos" },
  { level: 7, reward: "4.000 Puntos" },
  { level: 8, reward: "8.000 Puntos" },
  { level: 9, reward: "16.000 Puntos" },
  { level: 10, reward: "32.000 Puntos (META)" }
];
