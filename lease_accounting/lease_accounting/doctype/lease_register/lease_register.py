# Copyright (c) 2023, John Park and contributors
# For license information, please see license.txt

import frappe
from frappe import _, throw
import numpy as np
from frappe.utils import (
	add_days,
	add_months,
	cint,
	date_diff,
	flt,
	get_datetime,
	get_last_day,
	getdate,
	month_diff,
	nowdate,
	today,
)
from frappe.model.meta import get_field_precision
from frappe.model.document import Document
from erpnext.accounts.general_ledger import make_reverse_gl_entries

class LeaseRegister(Document):
	pass

	@frappe.whitelist()
	def get_monthly_dates(self):
		# self.validate_values()
		precision = get_field_precision(
			frappe.get_meta("Lease Register Item").get_field("lease_payment"),
			currency=frappe.get_cached_value("Company", self.company, "default_currency"),
		)
		date_list = self.get_monthly_date_list(self.start_date, self.no_of_months)
		last_idx = max(
			[cint(d.idx) for d in self.get("items")]
			or [
				0,
			]
		)
		if len(self.get("items")) ==0:
			for i, d in enumerate(date_list):
				ch = self.append("items", {})
				ch.posting_date = d
				ch.idx = last_idx + i + 1
				ch.lease_payment = flt(self.total/self.no_of_months, precision)

		# for d in self.get("items"):
		# 	if d.lease_payment:
		# 		d.accural= self.total/self.no_of_months - d.lease_payment
			
		self.save()
		# a =  np.npv(0.281,[-100, 19, 49, 58, 200])
	@frappe.whitelist()
	def get_monthly_pv(self):
		npv =0.0
		future_value = []
		for d in self.get("items"):
			future_value.append(d.lease_payment)
			d.pv = d.lease_payment/((1+(self.monthly_interest_rate/100))**(d.idx-1))
			npv += d.pv
			if d.lease_payment:
				d.accural= self.total/self.no_of_months - d.lease_payment
		# self.npv=np.npv(self.monthly_interest_rate,future_value)
		self.npv = npv
		self.save()

	@frappe.whitelist()
	def get_monthly_interest(self):
		ending_liability_value = 0.0
		ending_asset_value = 0.0
		for d in self.get("items"):
			if d.idx == 1:
				d.interest_expense = (self.npv - d.lease_payment) * self.monthly_interest_rate/100
				d.ending_liability_value = self.npv + d.interest_expense - d.lease_payment
				ending_liability_value = d.ending_liability_value
				d.principal = d.lease_payment - d.interest_expense 
				d.amortization =  d.accural + d.lease_payment -d.interest_expense
				ending_asset_value = self.npv - d.amortization
				d.ending_asset_value = ending_asset_value
			else:
				d.interest_expense = (ending_liability_value - d.lease_payment) * self.monthly_interest_rate/100
				d.ending_liability_value = ending_liability_value + d.interest_expense - d.lease_payment
				ending_liability_value = d.ending_liability_value 
				d.principal = d.lease_payment - d.interest_expense
				d.amortization =  d.accural + d.lease_payment -d.interest_expense
				ending_asset_value = ending_asset_value - d.amortization
				d.ending_asset_value = ending_asset_value
			d.depreciation = self.npv / self.no_of_months
		self.save()

	def get_monthly_date_list(self, start_date, no_of_months):
		posting_dt  = getdate(start_date)

		import calendar
		from datetime import datetime

		from dateutil import relativedelta
		date_list = []
		res = calendar.monthrange(posting_dt.year, posting_dt.month)
		day = res[1]

		for x in range(0,no_of_months):
			schedule_date = add_months(posting_dt, x)
			resp = calendar.monthrange(schedule_date.year, schedule_date.month)
			input_dt = datetime(schedule_date.year, schedule_date.month, resp[1])
			# print(input_dt.date())
			date_list.append(input_dt.date())
		return date_list
		

	@frappe.whitelist()
	def create_journal(self):
		self.make_journal_entry()

	@frappe.whitelist()
	def delete_journal_entries(self):
		if self.calculate_depreciation:
			for d in self.get("schedules"):
				if d.journal_entry:
					frappe.get_doc("Journal Entry", d.journal_entry).cancel()
		else:
			depr_entries = self.get_manual_depreciation_entries()

			for depr_entry in depr_entries or []:
				frappe.get_doc("Journal Entry", depr_entry.name).cancel()

			self.db_set(
				"value_after_depreciation",
				(flt(self.gross_purchase_amount) - flt(self.opening_accumulated_depreciation)),
			)
	
	def make_journal_entry(self):
		print(self.name)
		
		if self.items[0].journal_entry:
			print("Journal Entry"+ str(self.items[0].journal_entry))
		else:
			print("Journal Entry No"+ str(self.items[0].journal_entry))

			je = frappe.new_doc("Journal Entry")
			je.voucher_type = "Journal Entry"
			je.naming_series = self.abbr+"LS-.YY.MM.#######"
			je.company = self.company
			je.remark = "Lease Accounting Entry against Lease Register {0}".format(self.name)
			je.title = "Lease "+self.abbr+" {0}".format(self.name)

			je.append(
				"accounts",
				{
					"account": self.lease_asset,
					"reference_type": "Lease Register",
					"reference_name": self.name,
					"cost_center": self.cost_center,
					"debit_in_account_currency": self.npv,
				},
			)

			je.append(
				"accounts",
				{
					"account": self.lease_liability,
					"reference_type": "Lease Register",
					"reference_name": self.name,
					"cost_center": self.cost_center,
					"credit_in_account_currency": self.npv,
				},
			)

		return je