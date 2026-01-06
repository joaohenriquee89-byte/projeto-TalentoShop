
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Read env file manually since we are in a script
const envLocal = fs.readFileSync(path.resolve(__dirname, '../.env.local'), 'utf8');
const getEnv = (key: string) => {
    const match = envLocal.match(new RegExp(`${key}=(.*)`));
    return match ? match[1].trim() : '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseKey = getEnv('VITE_SUPABASE_ANON_KEY');

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkJobs() {
    console.log('Checking for jobs table...');
    const { data, error } = await supabase.from('jobs').select('*').limit(1);

    if (error) {
        console.error('Error checking jobs table:', error.message);
        if (error.message.includes('relation "public.jobs" does not exist')) {
            console.log('Jobs table does NOT exist.');
        } else {
            console.log('Jobs table check failed with other error.');
        }
    } else {
        console.log('Jobs table exists.');
        console.log('Sample data:', data);
    }
}

checkJobs();
