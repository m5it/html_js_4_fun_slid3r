# html_js_4_fun_slid3r
HTML Slider first used for ESP32 and remote car panel. To control car turns and moves.. 


Example:
https://codepen.io/bla-kos/full/PoeBPNN

Example of initialization:
<script>
  var slider = (new Slid3r({
        doubleside:true,
        element   :document.querySelector(".slider.hor .field"),
        onscroll  :function(e,pR,result) {
            document.querySelector(".slider.hor .info").innerText = result+" speed.";
        },
    }));
</script>

# Donate - Welcome - Thanks!
<a href="https://www.paypal.com/donate/?hosted_button_id=QGRYL4SL5N4FE"> Donate - Donar - Spenden - Daruj - пожертвовать - दान करना - 捐 - 寄付</a>
