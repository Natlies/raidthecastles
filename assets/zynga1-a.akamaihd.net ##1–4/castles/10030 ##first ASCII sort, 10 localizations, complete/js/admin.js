$(document).ready(function()
{
	$('#newItemTemplate').hide();
	$('#newItemSelect').change(changeNewItemSelection);
	
	function changeNewItemSelection(event)
	{
		var select = $(event.currentTarget);
		var value  = event.currentTarget.value;

		if (value == '')
		{
			return;
		}

		// Remove the option from the select
		$("option[value='" + value + "']", select).remove();

		// Create a new row for the added option
		var newItemRow = $('#newItemTemplate').clone(true);

		newItemRow.removeAttr('id');

		$('td.itemName', newItemRow).html(value);

		$('input', newItemRow).attr('name', 'ITEM_' + value);

		// Show the new row to the user
		$('#newItemRows').append(newItemRow);

		newItemRow.fadeIn();
	}
});
