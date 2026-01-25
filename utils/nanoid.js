import { customAlphabet } from "nanoid";

// Safe alphabet (no O, 0, I, l)
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

// Remaining length = 9 (1 fixed prefix + 9 nano chars = 10)
const nanoid = customAlphabet(ALPHABET, 9);



export const generateCarCode = () => `C${nanoid()}`;

export const generateBikeCode = () => `B${nanoid()}`;


export const generateTagCode = () => `T${nanoid()}`;

export const generateKeyTagCode = () => `K${nanoid()}`;

export const generateBusinessCardCode = () => `U${nanoid()}`;

export const generatePetTagCode = () => `P${nanoid()}`;