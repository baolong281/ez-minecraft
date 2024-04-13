import { createClient } from "@supabase/supabase-js";
import { config } from "./config";

// make later
// have to make schema and tables first and generate file
// https://supabase.com/docs/reference/javascript/typescript-support
// import { Database } from "./database.types";

// env values not actually generated yet
// export const db = createClient<Database> in the future after file is generated
export const db = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);
