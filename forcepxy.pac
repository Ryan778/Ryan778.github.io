var swgdomain = "extboss2.psdschools.net"
var domain = "psdschools.org"
var swgpublicip = "poudreschools122777-swg.ibosscloud.com"
 
/* MOST PEOPLE WILL NOT NEED TO EDIT BELOW THIS LINE: */
function FindProxyForURL(url,host) { 
hostIP = dnsResolve(host)

/*  Bypass the proxy for local resources: */
if (isPlainHostName(host) || 
shExpMatch(host, "*.local") || 
isInNet(hostIP, "10.0.0.0", "255.0.0.0") || 
isInNet(hostIP, "172.16.0.0", "255.240.0.0") || 
isInNet(hostIP, "192.168.0.0", "255.255.0.0") || 
isInNet(hostIP, "169.254.0.0", "255.255.0.0") ||
isInNet(hostIP, "164.104.0.0", "255.255.0.0") || 
isInNet(hostIP, "224.0.0.0", "240.0.0.0") || 
isInNet(hostIP, "240.0.0.0", "240.0.0.0") || 
isInNet(hostIP, "0.0.0.0", "255.0.0.0") || 
isInNet(hostIP, "127.0.0.0", "255.0.0.0")) 
{return "DIRECT"; } 

/* These domains are for your equipment specifically: */
else if (shExpMatch(host, "*" + domain)) 
{ return "DIRECT"; } 

/* These are for Google SSO: */
else if (shExpMatch(host, "*gstatic.com") || 
        shExpMatch(host, "accounts.google.com")) 
{ return "DIRECT"; } 

/* These are for Apple devices (such as iPads): */
else if (shExpMatch(host, "*appleiphonecell.com") || 
        shExpMatch(host, "*thinkdifferent.us") || 
        shExpMatch(host, "*airport.us") || 
        shExpMatch(host, "*ibook.info") || 
        shExpMatch(host, "captive.apple.com") || 
        shExpMatch(url, "http://gsp1.apple.com/pep/gcc") || 
        shExpMatch(host, "*itools.info") || 
        shExpMatch(url, "http://www.apple.com/library/test/success.html")) 
{ return "DIRECT"; } 

/* This section is for Microsoft: */
else if (shExpMatch(host, "*download.microsoft.com") || 
        shExpMatch(host, "*ntservicepack.microsoft.com") || 
        shExpMatch(host, "*windowsupdate.microsoft.com") || 
        shExpMatch(host, "*update.microsoft.com") || 
        shExpMatch(host, "*cdm.microsoft.com") || 
        shExpMatch(host, "*wustat.windows.com") || 
        shExpMatch(host, "*windowsupdate.com") ||
        shExpMatch(host, "*windowsupdate.microsoft.com")) 
{ return "DIRECT"; }

/* Captive portals (hotels and such) and local preferences: */
else if (shExpMatch(host, "*wayport.net")) 
{ return "DIRECT"; } 

/* This is for iboss servers */
else if (shExpMatch(host, "*.iboss.com") ||
        shExpMatch(host, "*.ibosscloud.com") ||
        isInNet(hostIP, "208.70.72.0", "255.255.248.0") || 
        isInNet(hostIP, "206.125.41.128", "255.255.255.192") || 
        (hostIP == swgpublicip)  )
{ return "DIRECT"; }

/* The final proxy statement: */
/* Force proxy even if on network: */
else { return "PROXY " + swgpublicip + ":8009"; } 
}
