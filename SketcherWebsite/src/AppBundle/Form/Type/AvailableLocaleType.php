<?php
namespace AppBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Translation\Translator;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\LocaleType;

class AvailableLocaleType extends AbstractType
{
	private $translator;
	
	public function __construct(Translator $translator)
	{
		$this->translator = $translator;
	}
	
	public function configureOptions(OptionsResolver $resolver)
	{
		$availableLocales = array();
		$locales = \Symfony\Component\Intl\Intl::getLocaleBundle()->getLocaleNames();
	
		// You know a better way ? Tell us please.
		$availableLocales['fr'] = $this->translator->trans($locales['fr']);
		$availableLocales['en'] = $this->translator->trans($locales['en']);
		
		$resolver->setDefaults(array(
			'choices' => array_flip($availableLocales)
		));
	}

	public function getParent()
	{
		return LocaleType::class;
	}
}