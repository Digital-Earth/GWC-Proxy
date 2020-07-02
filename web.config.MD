# IDAN: PLEASE READ THIS! 

Most of this file was auto generated from iisnode.yml by azure deploy.
The only things that was added (I didn't find way to do it in the portal is to upgrade
This is the modification for the web.config file

```xml
 <configuration>
   <system.webServer>
     <security>
       <requestFiltering>
         <!-- PYXIS CONFIG START -->
        
         <!-- 2GB limit
         <requestLimits maxAllowedContentLength="2147483648" />
         -->
         <!-- 500GB limit -->
         <requestLimits maxAllowedContentLength="536870912" />
        
         <!-- PYXIS CONFIG START -->

       </requestFiltering>
     </security>
   </system.webServer>
 </configuration>
```