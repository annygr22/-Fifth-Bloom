
/* ==========================================
   FIFTH BLOOM - CONEXÃO COM SUPABASE
   ========================================== */

import { createClient } from
    "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL =
    "https://wdumoxzdfeymzexmcxab.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_JyOMDVNeqfBuge4JGtiT2A_Nk41Z1qw";

// Criando a conexão
export const supabaseClient = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log("FIFTH BLOOM: Supabase conectado!");
