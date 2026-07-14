(function () {
  'use strict';

  const image = (file) => `assets/images/${file}`;

  const areas = [
    { id: 'tecnologia', nombre: 'Tecnología', color: '#0046f5', icono: 'code', imagen: image('areas-strip.jpg'), descripcion: 'Crea soluciones digitales para transformar empresas e industrias.' },
    { id: 'industria', nombre: 'Industria', color: '#6d36d8', icono: 'industry', imagen: image('areas-strip.jpg'), descripcion: 'Domina procesos, automatización y mantenimiento de alto nivel.' },
    { id: 'energia', nombre: 'Energía', color: '#13a461', icono: 'energy', imagen: image('areas-strip.jpg'), descripcion: 'Impulsa sistemas eléctricos eficientes y un futuro sostenible.' },
    { id: 'construccion', nombre: 'Construcción', color: '#ef7918', icono: 'build', imagen: image('areas-strip.jpg'), descripcion: 'Convierte planos y proyectos en infraestructura para el país.' },
    { id: 'diseno-comunicacion', nombre: 'Diseño y comunicación', color: '#d72b83', icono: 'design', imagen: image('areas-strip.jpg'), descripcion: 'Comunica ideas con creatividad, estrategia y tecnología.' },
    { id: 'gestion-negocios', nombre: 'Gestión y negocios', color: '#0677a8', icono: 'business', imagen: image('areas-strip.jpg'), descripcion: 'Gestiona organizaciones con una mirada práctica y digital.' }
  ];

  const sedes = [
    'Lima', 'Callao', 'Arequipa', 'Trujillo', 'Chiclayo', 'Piura',
    'Cusco', 'Ica', 'Huancayo', 'Cajamarca', 'Pucallpa', 'Tacna'
  ];

  const heroSlides = [
    { id: 'industria-alimentaria', eyebrow: 'Industria Alimentaria', title: 'Alimenta el presente, transforma el mañana', description: 'Conviértete en un profesional capaz de innovar, controlar y mejorar los procesos de la industria alimentaria.', ctaLabel: 'Conoce Industria Alimentaria', ctaUrl: 'detalle-carrera.html?id=industria-alimentaria', image: image('hero-industria-alimentaria.jpg'), alt: 'Estudiante de Industria Alimentaria en un laboratorio tecnológico de SENATI', accent: 'cyan' },
    { id: 'desarrollo-software', eyebrow: 'Desarrollo de Software', title: 'Código que crea soluciones, impacto que transforma', description: 'Desarrolla aplicaciones, plataformas y soluciones digitales que impulsan a las empresas y a la sociedad.', ctaLabel: 'Conoce Desarrollo de Software', ctaUrl: 'detalle-carrera.html?id=desarrollo-software', image: image('hero-desarrollo-software.jpg'), alt: 'Estudiante desarrollando software en un laboratorio digital de SENATI', accent: 'blue' },
    { id: 'mecatronica-industrial', eyebrow: 'Mecatrónica Industrial', title: 'Automatiza procesos, impulsa la industria', description: 'Integra mecánica, electrónica, automatización y tecnología para transformar los procesos industriales.', ctaLabel: 'Conoce Mecatrónica', ctaUrl: 'detalle-carrera.html?id=mecatronica-industrial', image: image('hero-mecatronica-industrial.jpg'), alt: 'Estudiante de Mecatrónica Industrial trabajando con un brazo robótico', accent: 'violet' },
    { id: 'energias-renovables', eyebrow: 'Energías Renovables', title: 'Impulsa el futuro de la energía sostenible', description: 'Fórmate para implementar soluciones energéticas eficientes y sostenibles para el país.', ctaLabel: 'Conoce Energías Renovables', ctaUrl: 'detalle-carrera.html?id=energias-renovables', image: image('hero-energias-renovables.jpg'), alt: 'Estudiante de Energías Renovables evaluando un panel solar en laboratorio', accent: 'green' },
    { id: 'construccion-civil', eyebrow: 'Construcción Civil', title: 'Construye la infraestructura que mueve al Perú', description: 'Participa en proyectos que mejoran las ciudades, la industria y la calidad de vida de las personas.', ctaLabel: 'Conoce Construcción Civil', ctaUrl: 'detalle-carrera.html?id=construccion-civil', image: image('hero-construccion-civil.jpg'), alt: 'Estudiante de Construcción Civil revisando una maqueta estructural', accent: 'orange' }
  ];

  const modalidades = [
    { id: 'tecnica', nombre: 'Carreras Técnicas (3 años)', descripcion: 'Formación práctica para insertarte rápido al mundo laboral.', icono: '⌁', programa: 'Carrera de 3 años', accent: 'blue' },
    { id: 'trabajadores', nombre: 'Carreras para Personas que Trabajan', descripcion: 'Estudia y trabaja al mismo tiempo con horarios flexibles.', icono: '▤', programa: 'Carreras para gente que trabaja', accent: 'teal' },
    { id: 'superior', nombre: 'Escuela Superior (4 años)', descripcion: 'Conviértete en profesional e impulsa la innovación.', icono: '⌂', programa: 'Carrera de 4 años', accent: 'violet', sede: 'Lima' },
    { id: 'virtual', nombre: 'Carreras Virtuales', descripcion: 'Estudia desde donde estés con una formación flexible.', icono: '▣', programa: 'Carrera virtual', accent: 'green' },
    { id: 'cursos', nombre: 'Cursos y Especializaciones', descripcion: 'Actualízate y desarrolla nuevas habilidades.', icono: '↗', programa: 'Curso corto', accent: 'orange' }
  ];

  const campuses = [
    { id: 'piura', name: 'Sede Piura', region: 'Piura', city: 'Piura', address: 'Av. Grau 1200, Piura', programs: ['Mecatrónica', 'Logística', 'Software'], modalities: ['Presencial', 'Virtual'], phone: '(073) 284 000', x: 16, y: 30 },
    { id: 'chiclayo', name: 'Sede Chiclayo', region: 'Lambayeque', city: 'Chiclayo', address: 'Carretera a Pimentel km 4.5, Chiclayo', programs: ['Electricidad Industrial', 'Administración', 'Software'], modalities: ['Presencial'], phone: '(074) 606 000', x: 22, y: 37 },
    { id: 'trujillo', name: 'Sede Trujillo', region: 'La Libertad', city: 'Trujillo', address: 'Av. América Norte 1820, Trujillo', programs: ['Industria', 'Software', 'Energía'], modalities: ['Presencial', 'Virtual'], phone: '(044) 616 000', x: 30, y: 45 },
    { id: 'callao', name: 'Sede Callao', region: 'Callao', city: 'Callao', address: 'Av. Argentina 4050, Callao', programs: ['Mecatrónica', 'Electrónica', 'Seguridad'], modalities: ['Presencial'], phone: '(01) 514 9600', x: 36, y: 63 },
    { id: 'independencia', name: 'Sede Independencia', region: 'Lima', city: 'Lima', address: 'Av. Túpac Amaru 210, Independencia', programs: ['Mecatrónica', 'Electricidad Industrial', 'Desarrollo de Software'], modalities: ['Presencial', 'Virtual'], phone: '(01) 514 9600', x: 38, y: 62 },
    { id: 'ate', name: 'Sede Ate', region: 'Lima', city: 'Lima', address: 'Carretera Central 2450, Ate', programs: ['Automatización', 'Logística', 'Construcción'], modalities: ['Presencial'], phone: '(01) 514 9600', x: 40, y: 64 },
    { id: 'huancayo', name: 'Sede Huancayo', region: 'Junín', city: 'Huancayo', address: 'Av. Mariscal Castilla 3909, Huancayo', programs: ['Mantenimiento Industrial', 'Diseño', 'Electricidad'], modalities: ['Presencial'], phone: '(064) 481 000', x: 49, y: 64 },
    { id: 'cusco', name: 'Sede Cusco', region: 'Cusco', city: 'Cusco', address: 'Av. de la Cultura 1805, Cusco', programs: ['Construcción', 'Energía', 'Gestión'], modalities: ['Presencial', 'Virtual'], phone: '(084) 581 000', x: 69, y: 71 },
    { id: 'arequipa', name: 'Sede Arequipa', region: 'Arequipa', city: 'Arequipa', address: 'Av. Parra 305, Arequipa', programs: ['Construcción', 'Energías Renovables', 'Mantenimiento'], modalities: ['Presencial'], phone: '(054) 381 000', x: 71, y: 85 },
    { id: 'tacna', name: 'Sede Tacna', region: 'Tacna', city: 'Tacna', address: 'Av. Industrial 1250, Tacna', programs: ['Electricidad Industrial', 'Mecatrónica', 'Logística'], modalities: ['Presencial'], phone: '(052) 583 000', x: 79, y: 93 }
  ];

  const areaImages = {
    'Tecnología': 'areas-strip.jpg', 'Industria': 'areas-strip.jpg', 'Energía': 'areas-strip.jpg',
    'Construcción': 'areas-strip.jpg', 'Diseño y comunicación': 'areas-strip.jpg', 'Gestión y negocios': 'areas-strip.jpg'
  };

  const carrera = (id, nombre, area, programa, modalidad, sedesDisponibles, demanda, extras = {}) => ({
    id,
    nombre,
    area,
    programa,
    modalidad,
    sedes: sedesDisponibles,
    demanda,
    color: extras.color || area.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-'),
    imagen: extras.imagen || image(areaImages[area] || 'area-tecnologia.jpg'),
    duracion: extras.duracion || programa.replace('Carrera de ', ''),
    titulo: extras.titulo || 'Profesional Técnico',
    descripcion: extras.descripcion || `Formación práctica para resolver retos reales en el campo de ${area.toLowerCase()}.`,
    aprenderas: extras.aprenderas || [],
    campoLaboral: extras.campoLaboral || [],
    requisitos: extras.requisitos || ['Documento de identidad', 'Certificado de estudios secundarios', 'Completar el proceso de admisión'],
    galeria: extras.galeria || []
  });

  const carreras = [
    carrera('industria-alimentaria', 'Industria Alimentaria', 'Industria', 'Carrera de 3 años', ['Presencial'], ['Lima', 'Arequipa', 'Trujillo'], 'Alta demanda laboral', {
      imagen: image('hero-industria-alimentaria.jpg'),
      descripcion: 'Gestiona y mejora procesos de producción, inocuidad y calidad en la industria de alimentos.',
      aprenderas: ['Control de calidad', 'Procesos de producción', 'Inocuidad alimentaria', 'Gestión de planta'],
      campoLaboral: ['Plantas de alimentos', 'Laboratorios de calidad', 'Empresas agroindustriales', 'Emprendimientos alimentarios']
    }),
    carrera('desarrollo-software', 'Desarrollo de Software', 'Tecnología', 'Carrera de 3 años', ['Presencial', 'Virtual'], ['Lima', 'Arequipa', 'Trujillo'], 'Alta demanda laboral', {
      descripcion: 'Diseña, desarrolla y prueba soluciones de software seguras, escalables y centradas en las personas.',
      aprenderas: ['Desarrollo web y móvil', 'Bases de datos', 'Pruebas de software', 'Trabajo con metodologías ágiles'],
      campoLaboral: ['Empresas de tecnología', 'Banca y fintech', 'Consultoras', 'Emprendimientos digitales']
    }),
    carrera('ciberseguridad', 'Ciberseguridad', 'Tecnología', 'Carrera de 3 años', ['Presencial', 'Virtual'], ['Lima', 'Arequipa'], 'Alta demanda laboral', {
      aprenderas: ['Seguridad de redes', 'Análisis de vulnerabilidades', 'Respuesta ante incidentes', 'Gestión de riesgos'],
      campoLaboral: ['Centros de operaciones de seguridad', 'Banca', 'Telecomunicaciones', 'Consultoras TI']
    }),
    carrera('inteligencia-artificial', 'Inteligencia Artificial', 'Tecnología', 'Carrera de 3 años', ['Presencial'], ['Lima'], 'Nueva carrera', {
      aprenderas: ['Programación con Python', 'Aprendizaje automático', 'Visión computacional', 'Preparación de datos']
    }),
    carrera('redes-comunicaciones', 'Redes y Comunicaciones', 'Tecnología', 'Carrera de 3 años', ['Presencial', 'Semipresencial'], ['Lima', 'Trujillo', 'Chiclayo'], 'Alta empleabilidad'),
    carrera('soporte-servicios-ti', 'Soporte y Servicios TI', 'Tecnología', 'Carrera de 2 años', ['Presencial', 'Virtual'], ['Lima', 'Arequipa', 'Piura'], 'Ingreso rápido al mercado'),
    carrera('mecatronica-automotriz', 'Mecatrónica Automotriz', 'Industria', 'Carrera de 3 años', ['Presencial'], ['Lima', 'Arequipa', 'Trujillo'], 'Alta demanda laboral', {
      imagen: image('mecatronica-automotriz-3d.jpg'),
      descripcion: 'El profesional técnico en Mecatrónica Automotriz está capacitado para instalar, mantener y reparar sistemas mecánicos, eléctricos y electrónicos en vehículos, utilizando herramientas de diagnóstico de última generación.',
      aprenderas: ['Diagnosticar sistemas mecánicos y electrónicos', 'Mantener motores y transmisiones', 'Configurar sensores y actuadores', 'Aplicar protocolos de seguridad automotriz'],
      campoLaboral: ['Talleres de servicio automotriz', 'Empresas de transporte', 'Concesionarios y casas automotrices', 'Empresas de diagnóstico automotriz'],
      galeria: [image('mecatronica-automotriz-3d.jpg'), image('mecatronica-sensores-3d.jpg'), image('mecatronica-diagnostico-3d.jpg')]
    }),
    carrera('mecatronica-industrial', 'Mecatrónica Industrial', 'Industria', 'Carrera de 3 años', ['Presencial'], ['Lima', 'Arequipa', 'Trujillo'], 'Alta demanda laboral', {
      imagen: image('hero-mecatronica-industrial.jpg'),
      descripcion: 'Integra automatización, electrónica y control para optimizar sistemas industriales inteligentes.',
      aprenderas: ['Automatización industrial', 'Controladores programables', 'Robótica aplicada', 'Sensores y actuadores'],
      campoLaboral: ['Plantas industriales', 'Integradores de automatización', 'Empresas de mantenimiento', 'Centros de control']
    }),
    carrera('automatizacion-industrial', 'Automatización Industrial', 'Industria', 'Carrera de 3 años', ['Presencial'], ['Lima', 'Arequipa', 'Trujillo', 'Chiclayo'], 'Alta demanda laboral'),
    carrera('mantenimiento-industrial', 'Mantenimiento Industrial', 'Industria', 'Carrera de 3 años', ['Presencial', 'Semipresencial'], ['Lima', 'Arequipa', 'Ica'], 'Alta empleabilidad'),
    carrera('produccion-industrial', 'Producción Industrial', 'Industria', 'Carrera de 3 años', ['Presencial'], ['Lima', 'Trujillo', 'Piura'], 'Alta empleabilidad'),
    carrera('logistica', 'Logística', 'Industria', 'Carrera de 3 años', ['Presencial', 'Virtual'], ['Lima', 'Arequipa', 'Trujillo'], 'Alta demanda laboral'),
    carrera('electricidad-industrial', 'Electricidad Industrial', 'Energía', 'Carrera de 3 años', ['Presencial'], ['Lima', 'Arequipa', 'Trujillo', 'Chiclayo'], 'Alta demanda laboral'),
    carrera('electronica-industrial', 'Electrónica Industrial', 'Energía', 'Carrera de 3 años', ['Presencial'], ['Lima', 'Arequipa'], 'Alta empleabilidad'),
    carrera('energias-renovables', 'Energías Renovables', 'Energía', 'Carrera de 3 años', ['Presencial', 'Semipresencial'], ['Lima', 'Arequipa', 'Piura'], 'Sector en crecimiento'),
    carrera('instalaciones-electricas', 'Instalaciones Eléctricas', 'Energía', 'Carrera de 2 años', ['Presencial'], ['Lima', 'Trujillo', 'Cusco'], 'Ingreso rápido al mercado'),
    carrera('climatizacion', 'Refrigeración y Climatización', 'Energía', 'Carrera de 3 años', ['Presencial'], ['Lima', 'Arequipa', 'Chiclayo'], 'Alta demanda laboral'),
    carrera('construccion-civil', 'Construcción Civil', 'Construcción', 'Carrera de 3 años', ['Presencial'], ['Lima', 'Arequipa', 'Trujillo'], 'Alta empleabilidad'),
    carrera('arquitectura-plataformas', 'Arquitectura de Plataformas', 'Construcción', 'Carrera de 3 años', ['Presencial'], ['Lima', 'Arequipa'], 'Especialidad tecnológica'),
    carrera('topografia', 'Topografía', 'Construcción', 'Carrera de 2 años', ['Presencial'], ['Lima', 'Arequipa', 'Cusco'], 'Alta demanda laboral'),
    carrera('seguridad-construccion', 'Seguridad en Construcción', 'Construcción', 'Carrera de 2 años', ['Presencial', 'Semipresencial'], ['Lima', 'Trujillo'], 'Alta empleabilidad'),
    carrera('costos-presupuestos', 'Costos y Presupuestos', 'Construcción', 'Carrera de 2 años', ['Presencial', 'Virtual'], ['Lima', 'Arequipa'], 'Alta empleabilidad'),
    carrera('diseno-grafico', 'Diseño Gráfico', 'Diseño y comunicación', 'Carrera de 3 años', ['Presencial', 'Virtual'], ['Lima', 'Arequipa', 'Trujillo'], 'Portafolio profesional'),
    carrera('diseno-interiores', 'Diseño de Interiores', 'Diseño y comunicación', 'Carrera de 3 años', ['Presencial'], ['Lima', 'Arequipa'], 'Industria creativa'),
    carrera('administracion-empresas', 'Administración de Empresas', 'Gestión y negocios', 'Carrera de 3 años', ['Presencial', 'Virtual'], ['Lima', 'Arequipa', 'Trujillo', 'Piura'], 'Alta empleabilidad'),
    carrera('contabilidad', 'Contabilidad', 'Gestión y negocios', 'Carrera de 3 años', ['Presencial', 'Virtual'], ['Lima', 'Arequipa', 'Chiclayo'], 'Alta empleabilidad'),
    carrera('marketing', 'Marketing', 'Gestión y negocios', 'Carrera de 3 años', ['Presencial', 'Virtual'], ['Lima', 'Trujillo'], 'Perfil digital')
  ];

  const testimonios = [
    {
      nombre: 'Carlos Rojas', carrera: 'Mecatrónica Automotriz', egreso: '2022', empresa: 'Ferreyros',
      foto: image('testimonios-strip.jpg'), logo: image('logo-ferreyros.svg'),
      testimonio: 'En SENATI aprendí haciendo. Esa experiencia me dio la confianza para diagnosticar retos reales desde mi primer día de trabajo.'
    },
    {
      nombre: 'Lucía Mendoza', carrera: 'Desarrollo de Software', egreso: '2023', empresa: 'BCP',
      foto: image('testimonios-strip.jpg'), logo: image('logo-bcp.svg'),
      testimonio: 'Los proyectos en equipo y el acompañamiento de mis docentes me prepararon para crear soluciones digitales que usan miles de personas.'
    },
    {
      nombre: 'Daniela Salazar', carrera: 'Electricidad Industrial', egreso: '2021', empresa: 'ENGIE',
      foto: image('testimonios-strip.jpg'), logo: image('logo-engie.svg'),
      testimonio: 'La formación práctica y la cultura de seguridad de SENATI marcaron la diferencia en mi crecimiento profesional.'
    }
  ];

  const empresas = [
    { nombre: 'Komatsu-Mitsui', logo: image('logo-komatsu.svg') },
    { nombre: 'Bosch', logo: image('logo-bosch.svg') },
    { nombre: 'Mitsui', logo: image('logo-mitsui.svg') },
    { nombre: 'BCP', logo: image('logo-bcp.svg') },
    { nombre: 'Cisco', logo: image('logo-cisco.svg') },
    { nombre: 'Ferreyros', logo: image('logo-ferreyros.svg') }
  ];

  const mallas = {
    'mecatronica-automotriz': [
      { semestre: 'Semestre 1', cursos: ['Matemática Aplicada', 'Física Aplicada', 'Electricidad Automotriz', 'Comunicación Técnica'] },
      { semestre: 'Semestre 2', cursos: ['Electrónica Automotriz', 'Sistemas de Inyección', 'Diagnóstico Automotriz', 'Dibujo Técnico'] },
      { semestre: 'Semestre 3', cursos: ['Motores de Combustión', 'Transmisiones', 'Sistemas de Frenos', 'Seguridad Industrial'] },
      { semestre: 'Semestre 4', cursos: ['Control Electrónico del Motor', 'Sistemas Híbridos', 'Dirección y Suspensión', 'Gestión del Mantenimiento'] },
      { semestre: 'Semestre 5', cursos: ['Vehículos Eléctricos', 'Redes Multiplexadas', 'Diagnóstico Avanzado', 'Proyecto de Innovación I'] },
      { semestre: 'Semestre 6', cursos: ['Tecnologías de Movilidad', 'Gestión de Talleres', 'Proyecto de Innovación II', 'Prácticas Profesionales'] }
    ]
  };

  carreras.forEach((item) => {
    if (!mallas[item.id]) {
      mallas[item.id] = [
        { semestre: 'Semestre 1', cursos: ['Fundamentos de la especialidad', 'Matemática aplicada', 'Comunicación profesional', 'Seguridad y salud'] },
        { semestre: 'Semestre 2', cursos: ['Procesos de la especialidad', 'Herramientas digitales', 'Taller aplicado I', 'Trabajo colaborativo'] },
        { semestre: 'Semestre 3', cursos: ['Sistemas especializados', 'Análisis de datos', 'Taller aplicado II', 'Inglés técnico'] },
        { semestre: 'Semestre 4', cursos: ['Integración de sistemas', 'Gestión de proyectos', 'Control de calidad', 'Innovación'] },
        { semestre: 'Semestre 5', cursos: ['Diagnóstico avanzado', 'Emprendimiento', 'Proyecto integrador I', 'Práctica en empresa'] },
        { semestre: 'Semestre 6', cursos: ['Gestión de operaciones', 'Proyecto integrador II', 'Ética profesional', 'Prácticas profesionales'] }
      ];
    }
  });

  window.SenatiData = Object.freeze({
    areas,
    sedes,
    heroSlides,
    modalidades,
    campuses,
    carreras,
    testimonios,
    empresas,
    mallas,
    whatsapp: Object.freeze({ numero: '51000000000', mensaje: 'Hola, quisiera recibir información sobre las carreras de SENATI.' })
  });
})();
