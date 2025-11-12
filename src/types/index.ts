export type Partido = {
    id_partido: string;
    nombre_partido: string;
    logo?: string | null;
    auth_users_id: string;
  };
  
  export type Candidato = {
    id_candidato: string;
    id_usuario: string;
    id_partido: string;
    nombre: string;
    apellido: string | null;
    cargo_buscado: string;
    imagen_url?: string | null;
  };
  
  export type Objetivo = {
    id_objetivo: number;
    descripcion: string;
    id_partido?: string;
    id_candidato?: string | null;
  };
  
  export type Presupuesto = {
    id_presupuesto: number;
    cantidad: number;
    descripcion: string;
    fecha: Date;
    id_partido: string;
    id_candidato?: string;
  };
  
  export type Propuesta = {
    id_propuesta: number;
    id_partido: string | null;
    id_candidato: string | null;
    descripcion: string;
    categoria: string;
    presupuesto_necesario: number;
  };
  
  export type Historia = {
    id_historia: number;
    descripcion: string;
    id_partido: string;
    id_candidato?: string;
  };
  
  export type Invitacion = {
    id: number;
    email: string;
    token: string;
    tipo: string;
    id_partido: string | null;
    usada: boolean;
    fecha_expiracion: string;
  };
  
  export type Profile = {
    id_usuario: string;
    nombre: string;
    apellido?: string | null;
    rol: string;
    id_partido: string;
  };
  
  export type Database = {
    public: {
      Tables: {
        partidos: {
          Row: Partido;
          Insert: Omit<Partido, 'id_partido'>;
          Update: Partial<Partido>;
        };
        candidatos: {
          Row: Candidato;
          Insert: Omit<Candidato, 'id_candidato'>;
          Update: Partial<Candidato>;
        };
        objetivos: {
          Row: Objetivo;
          Insert: Omit<Objetivo, 'id_objetivo'>;
          Update: Partial<Objetivo>;
        };
        presupuestos: {
          Row: Presupuesto;
          Insert: Omit<Presupuesto, 'id_presupuesto'>;
          Update: Partial<Presupuesto>;
        };
        propuestas: {
          Row: Propuesta;
          Insert: Omit<Propuesta, 'id_propuesta'>;
          Update: Partial<Propuesta>;
        };
        historias: {
          Row: Historia;
          Insert: Omit<Historia, 'id_historia'>;
          Update: Partial<Historia>;
        };
        invitaciones: {
          Row: Invitacion;
          Insert: Omit<Invitacion, 'id'>;
          Update: Partial<Invitacion>;
        };
        profiles: {
          Row: Profile;
          Insert: Profile;
          Update: Partial<Profile>;
        };
      };
    };
  };