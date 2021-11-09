Stripe.setPublishableKey('pk_test_51JT4LIBVeD4zCmLJoOpcZWF23pvJWVNPP1xm1xpDBkzUdaMorEzPeSP0vmSsk9dqmOtwY1Ymia7yN5L6ZnDgSYfL00xbMh94HM');

let $form=$('#checkout-form');

$form.submit(function(event)
{
    
    $form.find('button').prop('disabled',true);
    Stripe.card.createToken({
        number: $('card-number').val(),
        cvc: $('card-cvc').val(),
        exp_month: $('card-expiry-month').val(),
        exp_year: $('card-exp_year').val(),
        name: $('card-name').val()
    }, stripeResponseHandler);
    return false;
});

function stripeResponseHandler(status, response)
{
    if(response.error){
        //Problem!
        //show the errors on the form
        
        $('#charge-error').text(response.error.message);
        $('#charge-error').removeClass('hidden');
        $from.find('button').prop('disabled',false); //Re-enable submission
        
    } else {
        //Token has created
        //get the tokenID
        let token = response.id;

        //Insert the token into the form so it gets submitted to the server:
        $form.append($('<input type="hidden" name="stripeToken"/>').val(token));
        // Submit the form
        $from.get(0).submit();
        
    }
}