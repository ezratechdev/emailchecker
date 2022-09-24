const 
dns = require('node:dns'),
fs = require('node:fs'),
https = require('node:https'),
path = require('node:path'),
settings = {
    previous_data:Date.now(), // date of setting settings
    time:'172800000', // dowload time : 48 hours
    download_url:'https://disposable.github.io/disposable-email-domains/domains_mx.json',
}
;
function EmailChecker(email){
    this.email = email;
    // check settings and files
    if(!fs.existsSync('settings.json')){
        // download file
        this.download(settings.download_url);
        fs.writeFileSync('settings.json' , JSON.stringify(settings));
    } else{
        // 
        const settings = JSON.parse(fs.readFileSync(`${path.join(__dirname,'/settings.json')}`))
        const {
            previous_data,
            time,
        } = settings;
        if((Date.now() > parseInt(previous_data + time))){
            // download
            this.download(settings.download_url);
            fs.unlinkSync(`${__dirname}/settings.json`)
            fs.writeFileSync('settings.json' , JSON.stringify(settings));
        }
    }
}

// check synat
EmailChecker.prototype.syntax = function(){
    // check syntax of email
    // for uniformity
    const email = this.email;
    return new Promise((resolve , reject ) =>{
        if((email.includes('@') && email.includes('.') && email.length > 3)){
            resolve({
                    error:true,
                    email,
                    message:`${this.email} has an invalid syntax`,
            })
        }else{
            reject({
                error:false,
                email,
                message:`${this.email} has a valid syntax`,
            })
        }
    })
}

// check domain
EmailChecker.prototype.domain = function(){
    if(this.syntax(this.email).error){
        return this.syntax(this.email);
    };
    const email = this.email;
    const domain = email.split('@')[1];
    return new Promise((resolve , reject) =>{
        dns.resolve(domain , 'MX' , function(error , address){
            if(error){
                reject(
                    {
                        error:true,
                        email,
                        message:`Could not check the mx records of the domain hosting the email`,
                        address:[],
                    }
                );
            }
            if(address.length > 0){
                resolve(
                    {
                        error: false,
                        email,
                        message: `The domain of this email checks out`,
                        address,
                    }
                );
            }
        });
    })
}

// download function
EmailChecker.prototype.download = function(link){
    if(!link){
        return {
            error:true,
            message:`Download link was not passed`,
        }
    }
    const stream = fs.createWriteStream(`${__dirname}/data.json`);
    https.get(link , function(response){
        if(response.statusCode !== 200){
            return {
                error:true,
                message:`Unable to download`,
            }
        }
        response.pipe(stream)
        stream.on('error' , () =>{
            fs.unlinkSync(`${__dirname}/data.json`);
            return {
                error:true,
                message:`Error parsing data to file`,
            }
        })
        stream.on('finish' , function(){
            stream.close();
        });
    })
}

EmailChecker.prototype.temp = async function(){
    return await this.domainCheck()
    .then(() =>{
        // console.log(data);
        const domain = this.email.split('@')[1],
        domains = JSON.parse(fs.readFileSync(`${__dirname}/data.json`))
        temp_check = domains.indexOf(domain)
        ;
        if(temp_check == -1){
            return {
                email:this.email,
                message:`Is a temp mail`,
                temp:true,
                error:true,
            }
        }else{
            // valid email
            return {
                email:this.email,
                message:`Not a temp mail`,
                temp:false,
                error:false,
            }
        }
    })
    .catch((error) =>{
        return error;
    })
}

// EmailChecker.__
// new EmailChecker(`email@data.com`).syntax()
// .then(data =>{
//     console.log(`Success`);
//     console.log(data)
// })
// .catch(error =>{
//     console.log(`Error`)
//     console.log(error)
// })


