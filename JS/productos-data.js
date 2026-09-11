/*
  Datos extraídos del archivo de catálogo entregado.
    */

const PRODUCTOS = [
  { codigo: "GA001", categoria: "Guitarras Acústicas", nombre: "Guitarra Acústica Folk", marca: "Yamaha", modelo: "F310", stock: 8, precio: 129990, descripcion: "Tapa de abeto, aros y fondo de meranti. Ideal para iniciantes.", imagen: "https://i.pinimg.com/1200x/90/8c/c5/908cc57a4c2236a908d14a9fe2f1dfb2.jpg" },
  { codigo: "GA002", categoria: "Guitarras Acústicas", nombre: "Guitarra Acústica Dreadnought", marca: "Fender", modelo: "CD-60S", stock: 5, precio: 189990, descripcion: "Tapa de abeto macizo, brazo de caoba. Sonido cálido y proyectado.", imagen: "https://i.pinimg.com/1200x/46/a8/72/46a872bea4365e720f2b2b50eb0faf7d.jpg" },
  { codigo: "GA003", categoria: "Guitarras Acústicas", nombre: "Guitarra Acústica Clásica 4/4", marca: "Yamaha", modelo: "C40", stock: 10, precio: 89990, descripcion: "Nailon, tapa de abeto. Ideal para estudio y flamenco.", imagen: "https://i.pinimg.com/1200x/fc/1e/da/fc1eda13c9377d6c55a498ce34dffc69.jpg" },
  { codigo: "GA004", categoria: "Guitarras Acústicas", nombre: "Guitarra Electroacústica", marca: "Takamine", modelo: "GN20CE", stock: 3, precio: 349990, descripcion: "Pickup integrado, afinador incorporado.", imagen: "https://i.pinimg.com/736x/3b/51/f9/3b51f995654e660a57e357646d425c39.jpg" },
  { codigo: "GA005", categoria: "Guitarras Acústicas", nombre: "Guitarra 3/4 Niños", marca: "Yamaha", modelo: "JR1", stock: 6, precio: 79990, descripcion: "Tamaño reducido para niños de 6 a 10 años.", imagen: "https://i.pinimg.com/1200x/94/4e/5c/944e5cc8785f0a5ea7edb064d4429a05.jpg" },

  { codigo: "GE001", categoria: "Guitarras Eléctricas", nombre: "Guitarra Eléctrica Stratocaster", marca: "Squier", modelo: "Affinity Strat", stock: 5, precio: 249990, descripcion: "Cuerpo de álamo, mástil de arce, pastillas SSS.", imagen: "https://i.pinimg.com/736x/f4/f9/cd/f4f9cd36506f28881f335106825f891e.jpg" },
  { codigo: "GE002", categoria: "Guitarras Eléctricas", nombre: "Guitarra Eléctrica Les Paul", marca: "Epiphone", modelo: "Les Paul Std", stock: 4, precio: 329990, descripcion: "Cuerpo caoba, tapa arce, pastillas humbucker.", imagen: "https://i.pinimg.com/736x/b6/55/76/b6557638eb6b93578cbfc03f3bbf5f11.jpg" },
  { codigo: "GE003", categoria: "Guitarras Eléctricas", nombre: "Guitarra Eléctrica SG", marca: "Epiphone", modelo: "SG Standard", stock: 3, precio: 319990, descripcion: "Cuerpo caoba, mástil caoba, 2 humbuckers.", imagen: "https://i.pinimg.com/1200x/47/6c/9c/476c9c7458becf96de0dae16f2f5c661.jpg" },
  { codigo: "GE004", categoria: "Guitarras Eléctricas", nombre: "Guitarra Eléctrica Telecaster", marca: "Squier", modelo: "Affinity Tele", stock: 4, precio: 239990, descripcion: "Cuerpo álamo, clavijero vintage, 2 pastillas single.", imagen: "https://i.pinimg.com/1200x/a2/99/90/a2999093b8870506d7377b9a332bfd49.jpg" },
  { codigo: "GE005", categoria: "Guitarras Eléctricas", nombre: "Guitarra Eléctrica Semi-hollow", marca: "Epiphone", modelo: "ES-335", stock: 2, precio: 549990, descripcion: "Semi-hueca, 2 humbuckers, ideal para jazz y blues.", imagen: "https://i.pinimg.com/736x/11/f7/f0/11f7f0dff4935aa62613cc90c750fa0c.jpg" },

  { codigo: "BA001", categoria: "Bajos Eléctricos", nombre: "Bajo Eléctrico 4 Cuerdas", marca: "Squier", modelo: "Affinity PJ", stock: 5, precio: 299990, descripcion: "Pickup PJ, cuerpo álamo, mástil arce.",imagen: "https://i.pinimg.com/1200x/b7/03/00/b7030080b68eba6f4996be3b92ced7a9.jpg" },
  { codigo: "BA002", categoria: "Bajos Eléctricos", nombre: "Bajo Eléctrico Jazz Bass", marca: "Fender", modelo: "Player Jazz", stock: 2, precio: 699990, descripcion: "Alder body, 2 Alnico V Jazz single-coil.", imagen: "https://i.pinimg.com/1200x/e5/0c/21/e50c21367503e3b6d9e44b5ce891cc1b.jpg" },
  { codigo: "BA003", categoria: "Bajos Eléctricos", nombre: "Bajo Acústico 4 Cuerdas", marca: "Yamaha", modelo: "APX700II", stock: 2, precio: 429990, descripcion: "Electroacústico, afinador incorporado.", imagen: "https://i.pinimg.com/1200x/d6/f9/be/d6f9be14de5ff1e4a1df96fda0ade690.jpg" },

  { codigo: "BT001", categoria: "Baterías", nombre: "Batería Acústica 5 piezas", marca: "Pearl", modelo: "Roadshow", stock: 2, precio: 599990, descripcion: "Incluye stands, platillos y pedal de bombo.", imagen: "https://i.pinimg.com/1200x/68/f3/04/68f304a8cb8f91519f80bf523156b88d.jpg" },
  { codigo: "BT002", categoria: "Baterías", nombre: "Batería Electrónica 8 pads", marca: "Roland", modelo: "TD-02KV", stock: 2, precio: 799990, descripcion: "Módulo TD-02, 8 pads de goma, pedal hi-hat.", imagen: "https://i.pinimg.com/736x/d9/85/bb/d985bb3211be6b4f34f6fa8bb3ff39b3.jpg" },
  { codigo: "BT003", categoria: "Baterías", nombre: 'Caja Snare 14"', marca: "Pearl", modelo: "STE1450", stock: 4, precio: 89990, descripcion: 'Acero, 14x5", 10 tensores.', imagen: "https://i.pinimg.com/736x/e3/33/fe/e333fe6984588790917287efcce11818.jpg" },
  { codigo: "BT004", categoria: "Baterías", nombre: 'Platillo Hi-Hat 14"', marca: "Zildjian", modelo: "A Series", stock: 3, precio: 149990, descripcion: "Latón B20, sonido brillante y claro.", imagen: "https://i.pinimg.com/736x/0d/1c/dc/0d1cdc3fcdd2fc175445d2817ebf7ebc.jpg" },
  { codigo: "BT005", categoria: "Baterías", nombre: 'Platillo Crash 16"', marca: "Zildjian", modelo: "A Series", stock: 3, precio: 129990, descripcion: "Latón B20, ataque rápido.", imagen: "https://i.pinimg.com/736x/72/31/0b/72310b5670e9ec38d3ccf6e7fbafc2a6.jpg" },

  { codigo: "TC001", categoria: "Teclados y Pianos", nombre: "Teclado Digital 61 teclas", marca: "Yamaha", modelo: "PSR-E373", stock: 4, precio: 249990, descripcion: "61 teclas sensibles al tacto, 622 voces.", imagen: "https://i.pinimg.com/1200x/b1/b8/0e/b1b80ef76abdef4515418c5be41f4095.jpg" },
  { codigo: "TC002", categoria: "Teclados y Pianos", nombre: "Piano Digital 88 teclas", marca: "Yamaha", modelo: "P-45", stock: 2, precio: 499990, descripcion: "88 teclas pesadas, 10 voces, pedal sustain incluido.", imagen: "https://i.pinimg.com/1200x/49/a6/3c/49a63cb09be07a91f55a57e0e0156ad2.jpg" },
  { codigo: "TC003", categoria: "Teclados y Pianos", nombre: "Sintetizador 49 teclas", marca: "Arturia", modelo: "MiniLab MKII", stock: 5, precio: 129990, descripcion: "MIDI controller, 49 mini teclas.", imagen: "https://i.pinimg.com/1200x/70/16/33/70163337204016988ea175a05d9a36bb.jpg" },
  { codigo: "TC004", categoria: "Teclados y Pianos", nombre: "Teclado MIDI 88 teclas", marca: "M-Audio", modelo: "Hammer 88", stock: 2, precio: 399990, descripcion: "88 teclas martillo, sin sonidos propios.", imagen: "https://i.pinimg.com/1200x/31/2e/49/312e496578135b3a92dbb3629cddb004.jpg" },

  { codigo: "AM001", categoria: "Amplificadores", nombre: "Amplificador Guitarra 15W", marca: "Fender", modelo: "Frontman 15G", stock: 5, precio: 99990, descripcion: "15W, distorsión incorporada, entrada auxiliar.", imagen: "https://i.pinimg.com/1200x/53/8a/52/538a52f4f09272e963f25694bf39acee.jpg" },
  { codigo: "AM002", categoria: "Amplificadores", nombre: "Amplificador Guitarra 40W", marca: "Marshall", modelo: "MG40GFX", stock: 3, precio: 299990, descripcion: "40W, 4 canales, efectos digitales integrados.", imagen: "https://i.pinimg.com/1200x/86/c2/b1/86c2b1f7a299186d125a28b6492fcdb5.jpg" },
  { codigo: "AM003", categoria: "Amplificadores", nombre: "Amplificador Bajo 100W", marca: "Hartke", modelo: "HD100", stock: 2, precio: 449990, descripcion: "100W, tweeter integrado, ecualizador de 4 bandas.", imagen: "https://i.pinimg.com/1200x/99/e5/11/99e5117fce0d66fe77208016d6f87f0e.jpg" },
  { codigo: "AM004", categoria: "Amplificadores", nombre: "Amplificador Acústico 60W", marca: "Fishman", modelo: "Loudbox Mini", stock: 2, precio: 499990, descripcion: "60W, 2 canales, reverb y chorus incorporados.", imagen: "https://i.pinimg.com/736x/a5/3a/6e/a53a6ebe1a4b40b2036759da4699c0ed.jpg" },

  { codigo: "MI001", categoria: "Micrófonos", nombre: "Micrófono Dinámico Cardioide", marca: "Shure", modelo: "SM58", stock: 8, precio: 149990, descripcion: "Estándar industria para voz en vivo.", imagen: "https://i.pinimg.com/1200x/6f/71/53/6f7153476b23fe4fbd3d6f3c8a9cce7d.jpg" },
  { codigo: "MI002", categoria: "Micrófonos", nombre: "Micrófono Dinámico Instrumento", marca: "Shure", modelo: "SM57", stock: 6, precio: 139990, descripcion: "Ideal para captura de instrumentos y amplificadores.", imagen: "https://i.pinimg.com/1200x/93/7a/cd/937acda3453fdef6ddcec0de153c0074.jpg" },
  { codigo: "MI003", categoria: "Micrófonos", nombre: "Micrófono Condensador", marca: "Audio-Technica", modelo: "AT2020", stock: 4, precio: 199990, descripcion: "Cardioide, XLR, ideal para grabación en estudio.", imagen: "https://i.pinimg.com/1200x/7d/9b/dd/7d9bdd8e834c3f5358ae31afbe307767.jpg" },
  { codigo: "MI004", categoria: "Micrófonos", nombre: "Micrófono USB de Condensador", marca: "Blue", modelo: "Yeti", stock: 5, precio: 299990, descripcion: "USB, 4 patrones polares, ideal para streaming y podcast.", imagen: "https://i.pinimg.com/1200x/17/dd/0c/17dd0c5b3c6136c7cd260157c0715c7d.jpg" },

  { codigo: "PE001", categoria: "Pedales de Efectos", nombre: "Pedal Distorsión", marca: "Boss", modelo: "DS-1", stock: 7, precio: 79990, descripcion: "Clásico pedal de distorsión, 3 controles.", imagen: "https://i.pinimg.com/1200x/3a/94/89/3a9489de84d47f2ce59045dc81db77ff.jpg" },
  { codigo: "PE002", categoria: "Pedales de Efectos", nombre: "Pedal Reverb", marca: "Boss", modelo: "RV-6", stock: 4, precio: 179990, descripcion: "8 modos de reverb, control de shimmer.", imagen: "https://i.pinimg.com/1200x/6b/f2/3a/6bf23ad275062dda9d606cdb5981d0d9.jpg" },
  { codigo: "PE003", categoria: "Pedales de Efectos", nombre: "Pedal Multi-efectos", marca: "Boss", modelo: "ME-80", stock: 2, precio: 349990, descripcion: "Diseño tipo pedalboard, 8 efectos simultáneos.", imagen: "https://i.pinimg.com/736x/da/45/7b/da457beebf9097cfd8e855797931c95b.jpg" },
  { codigo: "PE004", categoria: "Pedales de Efectos", nombre: "Pedal Tuner Cromático", marca: "Boss", modelo: "TU-3", stock: 8, precio: 89990, descripcion: "Afinador cromático, indicador de tono.", imagen: "https://i.pinimg.com/1200x/0d/e5/a3/0de5a3ca64f413931089b6e87d12202f.jpg" },
  { codigo: "PE005", categoria: "Pedales de Efectos", nombre: "Pedal Delay", marca: "MXR", modelo: "Carbon Copy", stock: 4, precio: 179990, descripcion: "Delay analógico cálido, tiempo 600ms.", imagen: "https://i.pinimg.com/1200x/e6/e1/90/e6e190c4ec771a4a39e3c329f05fac7f.jpg" },
  { codigo: "PE006", categoria: "Pedales de Efectos", nombre: "Pedal Overdrive", marca: "Ibanez", modelo: "TS9", stock: 6, precio: 99990, descripcion: "Tube Screamer clásico, sonido suave y orgánico.", imagen: "https://i.pinimg.com/1200x/76/9a/41/769a41e4402e919b64d4166aab4d1387.jpg" },

  { codigo: "AC001", categoria: "Accesorios", nombre: "Cuerdas Guitarra Eléctrica 09-42", marca: "Ernie Ball", modelo: "Super Slinky", stock: 25, precio: 8990, descripcion: "Juego 6 cuerdas, calibre ligero.", imagen: "https://i.pinimg.com/1200x/20/0c/df/200cdf5c4e8a5f6e8ee39375475d9ed6.jpg" },
  { codigo: "AC002", categoria: "Accesorios", nombre: "Cuerdas Guitarra Acústica 12-53", marca: "Ernie Ball", modelo: "Earthwood", stock: 20, precio: 10990, descripcion: "Bronce fósforo, sonido cálido.", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_683844-MLC45520010382_042021-F-cuerdas-guitarra-electrica-ernie-ball-not-even-slinky-1256.webp" },
  { codigo: "AC003", categoria: "Accesorios", nombre: "Cuerdas Bajo 45-105", marca: "Ernie Ball", modelo: "Regular Slinky", stock: 12, precio: 14990, descripcion: "Cuerdas de níquel enrollado, set 4 cuerdas.", imagen: "https://i.pinimg.com/1200x/08/ad/e4/08ade481c77bafb989e2b7a619e5a30c.jpg" },
  { codigo: "AC004", categoria: "Accesorios", nombre: "Púas de Guitarra x10 (0.73mm)", marca: "Fender", modelo: "351", stock: 50, precio: 3990, descripcion: "Celulosa, grosor medio.", imagen: "https://i.pinimg.com/736x/d4/6a/0f/d46a0f6c5c5bd6f3b203a5b8ebd62bf8.jpg" },
  { codigo: "AC005", categoria: "Accesorios", nombre: "Capotraste Guitarra", marca: "Dunlop", modelo: "Trigger", stock: 15, precio: 12990, descripcion: "Capotraste de resorte, compatible 6 cuerdas.", imagen: "https://i.pinimg.com/1200x/9a/a1/2b/9aa12b1f7140403b069d23090c8cc8ce.jpg" },
  { codigo: "AC006", categoria: "Accesorios", nombre: "Afinador de Clip", marca: "Snark", modelo: "SN-5", stock: 20, precio: 8990, descripcion: "Afinador cromático de clip, pantalla giratoria.", imagen: "https://i.pinimg.com/736x/be/95/fa/be95fa729f099c949aea7c31ab5528b1.jpg" },
  { codigo: "AC007", categoria: "Accesorios", nombre: "Cable Instrumento 3m", marca: "Monster", modelo: "S100-I-3", stock: 15, precio: 12990, descripcion: "Cable trenzado, conectores dorados, 3 metros.", imagen: "https://i.pinimg.com/736x/e6/22/d1/e622d1ae90ae0f82567ef3ff3882f905.jpg" },
  { codigo: "AC008", categoria: "Accesorios", nombre: "Cable Instrumento 6m", marca: "Monster", modelo: "S100-I-6", stock: 10, precio: 17990, descripcion: "Cable trenzado, conectores dorados, 6 metros.", imagen: "https://i.pinimg.com/1200x/0e/7d/2e/0e7d2effe243618a43de075c13995959.jpg" },
  { codigo: "AC009", categoria: "Accesorios", nombre: "Soporte Guitarra de Piso", marca: "Hercules", modelo: "GS302B", stock: 12, precio: 22990, descripcion: "Soporte plegable con enganche automático.", imagen: "https://i.pinimg.com/736x/b0/49/b0/b049b04a02142d20675a0e6291677863.jpg" },
  { codigo: "AC010", categoria: "Accesorios", nombre: "Soporte Guitarra de Pared", marca: "Hercules", modelo: "WAH-202", stock: 10, precio: 18990, descripcion: "Montaje a pared, enganche automático.", imagen: "https://i.pinimg.com/736x/74/2a/87/742a873d928d480372eae661553386a0.jpg" },

  { codigo: "ES001", categoria: "Estudio y Grabación", nombre: "Interfaz de Audio 2x2 USB", marca: "Focusrite", modelo: "Scarlett Solo", stock: 4, precio: 149990, descripcion: "1 entrada XLR+instrumento, 2 salidas, 24bit/192kHz.", imagen: "https://i.pinimg.com/1200x/29/5c/59/295c5925c85c7b4cb1addbb37114efd9.jpg" },
  { codigo: "ES002", categoria: "Estudio y Grabación", nombre: "Auriculares de Estudio", marca: "Audio-Technica", modelo: "ATH-M20x", stock: 6, precio: 79990, descripcion: "Circumaurales, respuesta 15Hz-20kHz.", imagen: "https://i.pinimg.com/736x/37/1d/e7/371de7007fca08876a3509222a169fd7.jpg" },
  { codigo: "ES003", categoria: "Estudio y Grabación", nombre: "Auriculares de Estudio Pro", marca: "Audio-Technica", modelo: "ATH-M50x", stock: 4, precio: 219990, descripcion: "Referencia de industria, sonido neutro y detallado.", imagen: "https://i.pinimg.com/1200x/ed/32/ff/ed32ff2c8a35cca796cbccd3e2e865f0.jpg" },
  { codigo: "ES004", categoria: "Estudio y Grabación", nombre: 'Monitor de Estudio 5"', marca: "Yamaha", modelo: "HS5", stock: 2, precio: 349990, descripcion: "Altavoz activo, respuesta plana, ideal mezcla.", imagen: "https://i.pinimg.com/1200x/8d/83/8b/8d838bda76e7de6dbb15b2648e2898c5.jpg" },
  { codigo: "ES005", categoria: "Estudio y Grabación", nombre: "Pop Filter para Micrófono", marca: "Sennheiser", modelo: "MZP 40", stock: 8, precio: 14990, descripcion: "Doble malla, brazo flexible con clip.", imagen: "https://i.pinimg.com/1200x/6b/a5/d8/6ba5d81f1c8f6fc56d7340e1193303f7.jpg" }
];

// Umbral genérico de stock crítico para mostrar aviso en el listado (ajustable por producto en el admin)
const STOCK_CRITICO_DEFAULT = 3;

/**
 * Formatea un número como precio en pesos chilenos (CLP).
 * Ej: formatearCLP(129990) -> "$129.990"
 */
function formatearCLP(valor) {
  return "$" + Number(valor).toLocaleString("es-CL");
}

/**
 * Devuelve las iniciales de un nombre de producto, usadas como
 * marcador visual mientras no se cuenta con fotografías reales.
 */
function obtenerIniciales(nombre) {
  return nombre
    .split(" ")
    .filter(function (palabra) { return palabra.length > 0; })
    .slice(0, 2)
    .map(function (palabra) { return palabra[0].toUpperCase(); })
    .join("");
}

/**
 * Busca un producto por su código.
 */
function buscarProductoPorCodigo(codigo) {
  return PRODUCTOS.find(function (producto) { return producto.codigo === codigo; });
}


function colorPorCategoria(categoria) {
  const paleta = {
    "Guitarras Acústicas": "#5C4530",
    "Guitarras Eléctricas": "#8C2F2F",
    "Bajos Eléctricos": "#3D4A3E",
    "Baterías": "#4A3B5C",
    "Teclados y Pianos": "#2F5C58",
    "Amplificadores": "#5C3A2F",
    "Micrófonos": "#3A4A5C",
    "Pedales de Efectos": "#5C2F4A",
    "Accesorios": "#4A4A2F",
    "Estudio y Grabación": "#2F3E5C"
  };
  return paleta[categoria] || "#2A241C";
}
