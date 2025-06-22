import { getDB } from "../src/lib/db";
import { users } from "../src/lib/schema";
import { eq } from "drizzle-orm";

async function generateUsernames() {
  const db = await getDB();
  if (!db) {
    console.error("Failed to connect to database");
    return;
  }

  try {
    // Get all users without usernames
    const allUsers = await db.select().from(users);
    
    for (const user of allUsers) {
      if (!user.username && user.name) {
        // Generate username from name
        let username = user.name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '')
          .substring(0, 20);
        
        // Ensure username is unique by adding number if needed
        let counter = 1;
        let finalUsername = username;
        
        while (true) {
          const existingUser = await db.select()
            .from(users)
            .where(eq(users.username, finalUsername))
            .limit(1);
          
          if (existingUser.length === 0) {
            break;
          }
          
          finalUsername = `${username}${counter}`;
          counter++;
        }
        
        // Update user with new username
        await db.update(users)
          .set({ username: finalUsername })
          .where(eq(users.id, user.id));
        
        console.log(`Updated user ${user.name} with username: ${finalUsername}`);
      }
    }
    
    console.log("Finished generating usernames");
  } catch (error) {
    console.error("Error generating usernames:", error);
  }
}

generateUsernames();
