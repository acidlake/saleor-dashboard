import React from "react";
import { useIntl, FormattedMessage } from "react-intl";

import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import { UserError } from "@saleor/types";
import Grid from "@saleor/components/Grid";
import CardSpacer from "@saleor/components/CardSpacer";
import CompanyAddressInput from "@saleor/components/CompanyAddressInput";
import { AddressTypeInput } from "@saleor/customers/types";
import createSingleAutocompleteSelectHandler from "@saleor/utils/handlers/singleAutocompleteSelectChangeHandler";
import { mapCountriesToChoices } from "@saleor/utils/maps";
import useAddressValidation from "@saleor/hooks/useAddressValidation";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { maybe } from "@saleor/misc";
import { ShopInfo_shop } from "@saleor/components/Shop/types/ShopInfo";
import AppHeader from "@saleor/components/AppHeader";
import PageHeader from "@saleor/components/PageHeader";
import { sectionNames } from "@saleor/intl";
import WarehouseInfo from "../WarehouseInfo";

export interface WarehouseCreatePageFormData extends AddressTypeInput {
  name: string;
}
export interface WarehouseCreatePageProps {
  disabled: boolean;
  errors: UserError[];
  saveButtonBarState: ConfirmButtonTransitionState;
  shop: ShopInfo_shop;
  onBack: () => void;
  onSubmit: (data: WarehouseCreatePageFormData) => void;
}

const initialForm: WarehouseCreatePageFormData = {
  city: "",
  companyName: "",
  country: "",
  countryArea: "",
  name: "",
  phone: "",
  postalCode: "",
  streetAddress1: "",
  streetAddress2: ""
};

const WarehouseCreatePage: React.FC<WarehouseCreatePageProps> = ({
  disabled,
  errors: apiErrors,
  saveButtonBarState,
  shop,
  onBack,
  onSubmit
}) => {
  const intl = useIntl();
  const [displayCountry, setDisplayCountry] = useStateFromProps("");

  const {
    errors: validationErrors,
    submit: handleSubmit
  } = useAddressValidation<WarehouseCreatePageFormData>(onSubmit);

  return (
    <Form
      initial={initialForm}
      errors={[...apiErrors, ...validationErrors]}
      onSubmit={handleSubmit}
    >
      {({ change, data, errors, submit }) => {
        const countryChoices = mapCountriesToChoices(
          maybe(() => shop.countries, [])
        );
        const handleCountryChange = createSingleAutocompleteSelectHandler(
          change,
          setDisplayCountry,
          countryChoices
        );

        return (
          <Container>
            <AppHeader onBack={onBack}>
              <FormattedMessage {...sectionNames.warehouses} />
            </AppHeader>
            <PageHeader
              title={intl.formatMessage({
                defaultMessage: "Create Warehouse",
                description: "header"
              })}
            />
            <Grid>
              <div>
                <WarehouseInfo
                  data={data}
                  disabled={disabled}
                  errors={errors}
                  onChange={change}
                />
                <CardSpacer />
                <CompanyAddressInput
                  countries={countryChoices}
                  data={data}
                  disabled={disabled}
                  displayCountry={displayCountry}
                  errors={errors}
                  header={intl.formatMessage({
                    defaultMessage: "Address Information",
                    description: "warehouse"
                  })}
                  onChange={change}
                  onCountryChange={handleCountryChange}
                />
              </div>
            </Grid>
            <SaveButtonBar
              disabled={disabled}
              onCancel={onBack}
              onSave={submit}
              state={saveButtonBarState}
            />
          </Container>
        );
      }}
    </Form>
  );
};

WarehouseCreatePage.displayName = "WarehouseCreatePage";
export default WarehouseCreatePage;