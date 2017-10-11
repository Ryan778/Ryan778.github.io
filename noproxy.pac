var swgdomain = "extboss2.psdschools.net"
var domain = "psdschools.org"
var swgpublicip = "164.104.1.163"
 
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

return "DIRECT";
