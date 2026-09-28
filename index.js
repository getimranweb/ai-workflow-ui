import natural from 'natural';

console.log("⚡ Starting 100% Local Offline AI Automation Workflow...\n");

// A local helper function that creates a standard delay to simulate cloud operations
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// --- STEP 1: Brainstorm a Business Tagline ---
async function generateTagline(businessType) {
  console.log(`🤖 Step 1: Processing brand strategy for "${businessType}"...`);
  await pause(1000); // Simulate network processing time
  
  // Clean the string input
  const cleanInput = businessType.trim().toLowerCase();
  
  if (cleanInput.includes("automation") || cleanInput.includes("agency")) {
    return "Automate the Grid, Amplify the Future.";
  }
  return "Smarter Workflows, Faster Deliveries.";
}

// --- STEP 2: Turn that tagline into an Optimized Social Post ---
async function turnIntoSocialPost(tagline) {
  console.log(`🤖 Step 2: Running local linguistic transformer on the slogan...`);
  await pause(1200); 
  
  // Use the local tokenizer tool to analyze words
  const tokenizer = new natural.WordTokenizer();
  const tokenizedWords = tokenizer.tokenize(tagline);
  
  // Extract key descriptive words to convert into dynamic social metadata tags
  const dynamicHashtags = tokenizedWords
    .filter(word => word.length > 5)
    .map(word => `#${word}`)
    .slice(0, 2)
    .join(' ');

  return `📢 Post Preview:\n"${tagline}"\n\nScale operations seamlessly with customized integration architectures! ${dynamicHashtags}`;
}

// --- THE MASTER WORKFLOW CONTROLLER ---
async function runFullAIWorkflow() {
  try {
    // 1. Execute Step 1
    const rawTagline = await generateTagline("AI Automation Agency");
    console.log(`✨ Step 1 Output Generated: "${rawTagline}"\n`);
    
    // 2. Execute Step 2 (Passing the output of Step 1 straight into the input of Step 2)
    const finalPost = await turnIntoSocialPost(rawTagline);
    
    console.log("\n🎯 FINAL WORKFLOW RESULT DELIVERED TO CLIENT:");
    console.log(finalPost);
    
  } catch (error) {
    console.error("❌ Workflow halted due to local error:", error.message);
  }
}

runFullAIWorkflow();
