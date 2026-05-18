import { supabase } from "../lib/supabaseClient";

export const testConnection = async () => {
  const { data, error } = await supabase.from("voter_registration").select("*");

  console.log("DATA:", data);
  console.log("ERROR:", error);
};