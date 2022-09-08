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
function emailChecker(email){
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
emailChecker.prototype.syntax = function(){
    // check syntax of email
    if(!(this.email.includes('@') && this.email.includes('.') && this.email.length > 3)){
        return {
            ...{
            error:true,
            email:this.email,
            message:`${this.email} has an invalid syntax`,
        }
    }
    }
    return {
        ...
        {
            error:false,
            email:this.email,
            message:`${this.email} has a valid syntax`,
        }
    }
}

// check domain
emailChecker.prototype.domain = function(){
    if(this.syntax(this.email).error){
        return this.syntax(this.email);
    }
    let data = {
        error:undefined,
    };
    const domain = this.email.split('@')[1];
    dns.resolve(domain , 'MX' , function(error , address){
        if(error){
            data = {
                error:true,
                email:this.email,
                message:`Could not check the mx records of the domain hosting the email`,
                address:[],
            }
        }
        if(address.length > 0){
            data = {
                error: false,
                email: this.email,
                message: `The domain of this email checks out`,
                address,
            }
        }
        return data;
    })
}

// download function
emailChecker.prototype.download = function(link){
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

emailChecker.prototype.temp = function(){
    // if(this.domain().error){
    //     return this.domain()
    // }
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
        // valida email
        return {
            email:this.email,
            message:`Not a temp mail`,
            temp:false,
            error:false,
        }
    }
}

// emailChecker.__
console.log(new emailChecker('email@data.com').temp());


