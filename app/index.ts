import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { encode, decode } from "./service";

const prisma = new PrismaClient();
const app = new Hono();

app.get("/", (c) => c.text("Hello World Today!"));
app.get("/about", (c) => {
  return c.json({ 
    message: "Mongkhon Wichaiphap"});
});
app.get("/profile", async (c) => {
    //get data from db
    const profiles = await prisma.profile.findMany();

    profiles.forEach(data => {
        delete data.password;
    });

    //response
    return c.json({
        message: "get data completed",
        data: profiles
    }, 200);
});
app.post("/profile", async (c) => {
    //logic to create a new profile
    const body = await c.req.json();

    const passwordHash = await bcrypt.hash(body.password, 13);
    body.password = passwordHash;

    //encode mobile;
    body.mobile = encode(body.mobile);

    //encode cardId
    body.cardId = encode(body.cardId);

    //data before save
    console.log('data before save ', body);

    //save to db
    body.status= false;
    const result = await prisma.profile.create({
        data: body
    })
    .then(data => { 
        delete data.password;
        console.log('create profile completed', data);
        return data;
    })
    .catch(err => {
        console.log(`create profile failed `, JSON.stringify(err?.message));
        // switch case error message
        return "please recheck username, mobile or cardId";
    });

    //output response
    return c.json({
        message: "create profile completed",
        data: result
    });
});
app.get("/profile/:id", async (c) => {
    //get some data from db
    const id = c.req.param('id');
    console.log('id ', id);
    const profile = await prisma.profile.findFirstOrThrow({
        where: {
            id: id
        }
    });
    delete profile.password;
    console.log(`cardId`, profile.cardId.length);
    console.log(`mobile`, profile.mobile.length);

    // Decode ออกมาเป็นค่าจริง
    profile.mobile = decode(profile.mobile);
    profile.cardId = decode(profile.cardId);
    // profile.cardId = ;

    return c.json({
        message: "get data completed",
        data: profile
    }, 200);
});

export default app;
