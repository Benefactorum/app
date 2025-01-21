FactoryBot.define do
  factory :annual_finance do
    period { "MyString" }
    treasury { "9.99" }
    budget { "9.99" }
    certified { false }
    employees_count { 1 }
  end
end
