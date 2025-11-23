
import { Configuration, OpenAIApi } from "openai";

export default async function handler(req,res){
  const {goal}=req.body;
  const client=new OpenAIApi(new Configuration({apiKey:process.env.OPENAI_API_KEY}));
  const resp=await client.createChatCompletion({
    model:"gpt-4o-mini",
    messages:[{role:"user",content:`Crie um plano de treino para o objetivo: ${goal}` }]
  });
  res.json({plan: resp.data.choices[0].message.content});
}
